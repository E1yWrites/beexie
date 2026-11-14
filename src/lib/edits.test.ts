import { describe, expect, it } from 'vitest';
import { applyPalette, processColors } from './colors';
import { paintPixel, pixelAt } from './edits';
import type { ProcessedImage } from '../types';

const blank = (): ProcessedImage => ({ width: 2, height: 2, data: new Uint8ClampedArray(16).fill(255), palette: [] });

describe('touch-up edits', () => {
  it('paints without mutating, erases, and reads back', () => {
    const a = blank();
    const b = paintPixel(a, 1, 0, { r: 10, g: 20, b: 30 });
    expect(a.data[4]).toBe(255);
    expect(pixelAt(b, 1, 0)).toEqual({ r: 10, g: 20, b: 30 });
    expect(pixelAt(paintPixel(b, 1, 0, null), 1, 0)).toBeNull();
    expect(paintPixel(a, 5, 5, null)).toBe(a);
  });
});

describe('bayer dithering', () => {
  const ramp = () => {
    const data = new Uint8ClampedArray(8 * 8 * 4);
    for (let i = 0; i < 64; i += 1) data.set([128, 128, 128, 255], i * 4);
    return { width: 8, height: 8, data };
  };
  const bw = [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }];
  it('is deterministic, uses only palette colors, and mixes mid-gray', () => {
    const one = applyPalette(ramp(), bw, true, true);
    const two = applyPalette(ramp(), bw, true, true);
    expect(Array.from(one.data)).toEqual(Array.from(two.data));
    const whites = Array.from({ length: 64 }, (_, i) => one.data[i * 4]).filter((v) => v === 255).length;
    expect(whites).toBeGreaterThan(20);
    expect(whites).toBeLessThan(44);
  });
  it('processColors honors ditherMode', () => {
    const out = processColors(ramp(), {
      mode: 'monochrome', reducedColors: 2, customPalette: [], quantization: 0, dithering: true,
      ditherMode: 'bayer', transparentBackground: false, backgroundColor: '#ffffff',
    });
    expect(new Set(Array.from({ length: 64 }, (_, i) => out.data[i * 4]))).toEqual(new Set([0, 255]));
  });
});
