import type { Rotation, SourceTransform } from '../types';

/** Crop as fractions (0 to 1) of the rotated image, so it survives the source cap and display scaling. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const IDENTITY_TRANSFORM: SourceTransform = { rotation: 0, crop: null };

/** Smallest crop side, as a fraction, so a crop never collapses below a pixel or two. */
export const MIN_CROP = 0.02;

export function isIdentity(t: SourceTransform): boolean {
  return t.rotation === 0 && t.crop === null;
}

export function clampCrop(crop: CropRect): CropRect {
  const width = Math.min(1, Math.max(MIN_CROP, crop.width));
  const height = Math.min(1, Math.max(MIN_CROP, crop.height));
  return {
    x: Math.min(1 - width, Math.max(0, crop.x)),
    y: Math.min(1 - height, Math.max(0, crop.y)),
    width,
    height,
  };
}

/** Rotating the image by a quarter turn carries the crop rectangle with it. */
export function rotateCrop(crop: CropRect, direction: 1 | -1): CropRect {
  return direction === 1
    ? { x: 1 - crop.y - crop.height, y: crop.x, width: crop.height, height: crop.width }
    : { x: crop.y, y: 1 - crop.x - crop.width, width: crop.height, height: crop.width };
}

export function rotate(t: SourceTransform, direction: 1 | -1): SourceTransform {
  return {
    rotation: (((t.rotation + direction * 90) % 360) + 360) % 360 as Rotation,
    crop: t.crop ? rotateCrop(t.crop, direction) : null,
  };
}

export function rotatedSize(width: number, height: number, rotation: Rotation): { width: number; height: number } {
  return rotation % 180 === 0 ? { width, height } : { width: height, height: width };
}

/** Pixel rectangle of the crop inside the rotated image, at least 1 x 1. */
export function cropPixels(width: number, height: number, t: SourceTransform) {
  const turned = rotatedSize(width, height, t.rotation);
  const crop = t.crop ?? { x: 0, y: 0, width: 1, height: 1 };
  const x = Math.min(turned.width - 1, Math.round(crop.x * turned.width));
  const y = Math.min(turned.height - 1, Math.round(crop.y * turned.height));
  return {
    turned,
    x,
    y,
    width: Math.max(1, Math.min(turned.width - x, Math.round(crop.width * turned.width))),
    height: Math.max(1, Math.min(turned.height - y, Math.round(crop.height * turned.height))),
  };
}

/** Lock a crop to a width / height ratio in pixels, keeping its center and staying inside the image. */
export function lockCrop(crop: CropRect, ratio: number, imageWidth: number, imageHeight: number): CropRect {
  const fractionRatio = (ratio * imageHeight) / imageWidth;
  let width = crop.width;
  let height = width / fractionRatio;
  if (height > 1) {
    height = 1;
    width = fractionRatio;
  }
  const cx = crop.x + crop.width / 2;
  const cy = crop.y + crop.height / 2;
  return clampCrop({ x: cx - width / 2, y: cy - height / 2, width, height });
}

/** Draw the source rotated and cropped. Pure input transform: no pixel is painted, only selected and turned. */
export function applyTransform(
  bitmap: CanvasImageSource,
  width: number,
  height: number,
  t: SourceTransform,
): HTMLCanvasElement {
  const px = cropPixels(width, height, t);
  const canvas = document.createElement('canvas');
  canvas.width = px.width;
  canvas.height = px.height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.translate(-px.x, -px.y);
  ctx.translate(px.turned.width / 2, px.turned.height / 2);
  ctx.rotate((t.rotation * Math.PI) / 180);
  ctx.drawImage(bitmap, -width / 2, -height / 2);
  return canvas;
}
