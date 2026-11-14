import { MAX_SOURCE_DIMENSION } from '../constants';
import { createCanvas, getContext2d } from './pixelate';
import { validateFile } from './validation';
import type { SourceImage } from '../types';

/**
 * Decode a file to something drawable. Prefers createImageBitmap for speed and
 * EXIF-aware orientation, falls back to <img> where unavailable.
 */
async function decode(file: File, url: string): Promise<CanvasImageSource> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Some browsers reject certain blobs/options; the image element handles them.
    }
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('That file could not be decoded as an image.'));
    image.src = url;
  });
}

function capSource(source: CanvasImageSource, width: number, height: number): CanvasImageSource {
  const longest = Math.max(width, height);
  if (longest <= MAX_SOURCE_DIMENSION) return source;

  const factor = MAX_SOURCE_DIMENSION / longest;
  const targetWidth = Math.max(1, Math.round(width * factor));
  const targetHeight = Math.max(1, Math.round(height * factor));
  const canvas = createCanvas(targetWidth, targetHeight);
  const context = getContext2d(canvas);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, targetWidth, targetHeight);

  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    source.close();
  }

  return canvas;
}

function dimensionsOf(source: CanvasImageSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth || source.width, height: source.naturalHeight || source.height };
  }
  if (source instanceof HTMLCanvasElement) {
    return { width: source.width, height: source.height };
  }
  const sized = source as { width?: number; height?: number };
  return { width: Number(sized.width ?? 0), height: Number(sized.height ?? 0) };
}

export async function loadSourceImage(file: File): Promise<SourceImage> {
  const validation = validateFile(file);
  if (!validation.ok) throw new Error(validation.error);

  const url = URL.createObjectURL(file);
  let decoded: CanvasImageSource;
  try {
    decoded = await decode(file, url);
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error instanceof Error ? error : new Error('That file could not be decoded as an image.');
  }

  const natural = dimensionsOf(decoded);
  if (natural.width < 1 || natural.height < 1) {
    URL.revokeObjectURL(url);
    throw new Error('That image has no readable pixels.');
  }

  const bitmap = capSource(decoded, natural.width, natural.height);
  const finalDimensions = bitmap === decoded ? natural : dimensionsOf(bitmap);

  return {
    bitmap,
    width: finalDimensions.width,
    height: finalDimensions.height,
    name: file.name || 'pasted-image',
    type: file.type || 'image/*',
    size: file.size,
    url,
  };
}

export function releaseSource(source: SourceImage | null): void {
  if (!source) return;
  URL.revokeObjectURL(source.url);
  if (typeof ImageBitmap !== 'undefined' && source.bitmap instanceof ImageBitmap) {
    source.bitmap.close();
  }
}
