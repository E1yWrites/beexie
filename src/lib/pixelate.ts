import type { ProcessedImage, RgbaImage } from '../types';

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function getContext2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D is not available in this browser.');
  return context;
}

/**
 * Progressive halving keeps downscales close to area-averaged even when the
 * browser's single-step smoothing aliases badly (large photo → tiny grid).
 */
function downsampleSource(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): CanvasImageSource {
  let current: CanvasImageSource = source;
  let width = sourceWidth;
  let height = sourceHeight;

  while (Math.max(width / targetWidth, height / targetHeight) > 2) {
    const nextWidth = Math.max(targetWidth, Math.floor(width / 2));
    const nextHeight = Math.max(targetHeight, Math.floor(height / 2));
    if (nextWidth >= width && nextHeight >= height) break;

    const step = createCanvas(nextWidth, nextHeight);
    const context = getContext2d(step);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(current, 0, 0, nextWidth, nextHeight);
    current = step;
    width = nextWidth;
    height = nextHeight;
  }

  return current;
}

export function rasterizeToGrid(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  gridWidth: number,
  gridHeight: number,
  backgroundColor: string | null,
): RgbaImage {
  const width = Math.max(1, Math.round(gridWidth));
  const height = Math.max(1, Math.round(gridHeight));
  const canvas = createCanvas(width, height);
  const context = getContext2d(canvas);

  context.clearRect(0, 0, width, height);
  if (backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }

  if (sourceWidth > 0 && sourceHeight > 0) {
    const reduced = downsampleSource(source, sourceWidth, sourceHeight, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(reduced, 0, 0, width, height);
  }

  const data = context.getImageData(0, 0, width, height);
  return { width: data.width, height: data.height, data: data.data };
}

function getGridOverlayColor(): string {
  if (typeof document === 'undefined') return 'rgba(0, 0, 0, 0.28)';
  const ink = getComputedStyle(document.documentElement)
    .getPropertyValue('--ink')
    .trim();
  const match = ink.match(/#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
  if (!match) return 'rgba(0, 0, 0, 0.28)';
  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.5 ? 'rgba(0, 0, 0, 0.28)' : 'rgba(255, 255, 255, 0.28)';
}

function drawGridOverlay(
  context: CanvasRenderingContext2D,
  displayWidth: number,
  displayHeight: number,
  gridWidth: number,
  gridHeight: number,
): void {
  const stepX = displayWidth / gridWidth;
  const stepY = displayHeight / gridHeight;
  if (stepX < 6 && stepY < 6) return;

  context.save();
  context.strokeStyle = getGridOverlayColor();
  context.lineWidth = 1;
  context.beginPath();
  if (stepX >= 6) {
    for (let x = 1; x < gridWidth; x += 1) {
      const px = Math.round(x * stepX) + 0.5;
      context.moveTo(px, 0);
      context.lineTo(px, displayHeight);
    }
  }
  if (stepY >= 6) {
    for (let y = 1; y < gridHeight; y += 1) {
      const py = Math.round(y * stepY) + 0.5;
      context.moveTo(0, py);
      context.lineTo(displayWidth, py);
    }
  }
  context.stroke();
  context.restore();
}

/** Render the processed grid into a canvas at an arbitrary display size, crisp. */
export function renderProcessedPreview(
  canvas: HTMLCanvasElement,
  processed: ProcessedImage,
  displayWidth: number,
  displayHeight: number,
  gridOverlay: boolean,
): void {
  const width = Math.max(1, Math.round(displayWidth));
  const height = Math.max(1, Math.round(displayHeight));
  canvas.width = width;
  canvas.height = height;
  const context = getContext2d(canvas);
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, width, height);

  const gridCanvas = putProcessedToCanvas(processed);
  context.drawImage(gridCanvas, 0, 0, width, height);

  if (gridOverlay) drawGridOverlay(context, width, height, processed.width, processed.height);
}

const gridCanvasCache = new WeakMap<ProcessedImage, HTMLCanvasElement>();

function putProcessedToCanvas(processed: ProcessedImage): HTMLCanvasElement {
  const cached = gridCanvasCache.get(processed);
  if (cached) return cached;

  const canvas = createCanvas(processed.width, processed.height);
  const context = getContext2d(canvas);
  const imageData = new ImageData(new Uint8ClampedArray(processed.data), processed.width, processed.height);
  context.putImageData(imageData, 0, 0);
  gridCanvasCache.set(processed, canvas);
  return canvas;
}

/** Full-resolution export render. Nearest-neighbour only. */
export function renderProcessedToCanvas(
  processed: ProcessedImage,
  width: number,
  height: number,
  backgroundColor: string | null,
): HTMLCanvasElement {
  const canvas = createCanvas(width, height);
  const context = getContext2d(canvas);
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(putProcessedToCanvas(processed), 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('This browser could not encode the selected image format.'));
      },
      mime,
      quality,
    );
  });
}
