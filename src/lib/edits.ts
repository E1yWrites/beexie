import type { ProcessedImage, Rgb } from '../types';

export type EditTool = 'off' | 'pencil' | 'eraser' | 'picker';

/** Returns a new image with one pixel painted (null = erase to transparent), or the same image if out of bounds/unchanged. */
export function paintPixel(image: ProcessedImage, x: number, y: number, color: Rgb | null): ProcessedImage {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) return image;
  const i = (y * image.width + x) * 4;
  const [r, g, b, a] = color ? [color.r, color.g, color.b, 255] : [0, 0, 0, 0];
  const d = image.data;
  if (d[i] === r && d[i + 1] === g && d[i + 2] === b && d[i + 3] === a) return image;
  const data = new Uint8ClampedArray(d);
  data.set([r, g, b, a], i);
  return { ...image, data };
}

export function pixelAt(image: ProcessedImage, x: number, y: number): Rgb | null {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) return null;
  const i = (y * image.width + x) * 4;
  return image.data[i + 3] === 0 ? null : { r: image.data[i], g: image.data[i + 1], b: image.data[i + 2] };
}
