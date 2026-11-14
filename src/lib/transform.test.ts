import { describe, expect, it } from 'vitest';
import { clampCrop, cropPixels, IDENTITY_TRANSFORM, isIdentity, lockCrop, rotate, rotateCrop, rotatedSize } from './transform';

describe('source transform', () => {
  it('rotates in quarter turns both ways and wraps', () => {
    let t = rotate(IDENTITY_TRANSFORM, 1);
    expect(t.rotation).toBe(90);
    t = rotate(rotate(rotate(t, 1), 1), 1);
    expect(t.rotation).toBe(0);
    expect(rotate(IDENTITY_TRANSFORM, -1).rotation).toBe(270);
    expect(isIdentity(t)).toBe(true);
  });

  it('swaps sides for 90 and 270', () => {
    expect(rotatedSize(120, 60, 90)).toEqual({ width: 60, height: 120 });
    expect(rotatedSize(120, 60, 180)).toEqual({ width: 120, height: 60 });
  });

  it('carries the crop with the image and undoes cleanly', () => {
    const crop = { x: 0.1, y: 0.2, width: 0.3, height: 0.4 };
    // Top-left region turns clockwise to the top-right.
    expect(rotateCrop(crop, 1)).toEqual({ x: 1 - 0.2 - 0.4, y: 0.1, width: 0.4, height: 0.3 });
    const back = rotateCrop(rotateCrop(crop, 1), -1);
    for (const key of ['x', 'y', 'width', 'height'] as const) expect(back[key]).toBeCloseTo(crop[key]);
  });

  it('clamps crops inside the image', () => {
    expect(clampCrop({ x: 0.9, y: -0.2, width: 0.5, height: 2 })).toEqual({ x: 0.5, y: 0, width: 0.5, height: 1 });
    expect(clampCrop({ x: 0, y: 0, width: 0, height: 0 }).width).toBeGreaterThan(0);
  });

  it('maps crops to pixels in the rotated image', () => {
    const px = cropPixels(120, 60, { rotation: 90, crop: { x: 0.5, y: 0, width: 0.5, height: 0.5 } });
    expect(px).toMatchObject({ x: 30, y: 0, width: 30, height: 60 });
    expect(cropPixels(120, 60, IDENTITY_TRANSFORM)).toMatchObject({ x: 0, y: 0, width: 120, height: 60 });
  });

  it('locks a crop to a pixel ratio', () => {
    const square = lockCrop({ x: 0, y: 0, width: 0.5, height: 1 }, 1, 200, 100);
    expect(square.width * 200).toBeCloseTo(square.height * 100);
    expect(square.height).toBeLessThanOrEqual(1);
  });
});
