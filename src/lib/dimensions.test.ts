import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, MAX_GRID, MAX_OUTPUT_DIMENSION } from '../constants';
import {
  computeAutoOutput,
  computeExportSize,
  computeGrid,
  derivedPixelSize,
  gridFromPixelSize,
  isExportSizeValid,
  linkHeight,
  linkWidth,
} from './dimensions';
import type { ConverterSettings } from '../types';

function settingsWith(overrides: Partial<ConverterSettings>): ConverterSettings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

describe('computeGrid', () => {
  it('applies presets to the longest side and preserves landscape aspect', () => {
    const grid = computeGrid({ width: 1920, height: 1080 }, settingsWith({ preset: 64 }));
    expect(grid).toEqual({ width: 64, height: 36 });
  });

  it('applies presets to the longest side in portrait', () => {
    const grid = computeGrid({ width: 1080, height: 1920 }, settingsWith({ preset: 32 }));
    expect(grid).toEqual({ width: 18, height: 32 });
  });

  it('keeps at least one pixel per side for extreme aspect ratios', () => {
    const grid = computeGrid({ width: 10000, height: 40 }, settingsWith({ preset: 8 }));
    expect(grid.width).toBe(8);
    expect(grid.height).toBe(1);
  });

  it('uses custom grid dimensions exactly', () => {
    const grid = computeGrid(
      { width: 1920, height: 1080 },
      settingsWith({ resolutionMode: 'custom', customGrid: { width: 100, height: 75 } }),
    );
    expect(grid).toEqual({ width: 100, height: 75 });
  });

  it('clamps custom dimensions to the supported range', () => {
    const grid = computeGrid(
      { width: 100, height: 100 },
      settingsWith({ resolutionMode: 'custom', customGrid: { width: 0, height: 99999 } }),
    );
    expect(grid.width).toBe(1);
    expect(grid.height).toBe(MAX_GRID);
  });
});

describe('pixel size helpers', () => {
  it('derives a clamped source-pixels-per-art-pixel value', () => {
    expect(derivedPixelSize({ width: 1920, height: 1080 }, { width: 64, height: 36 })).toBe(30);
    expect(derivedPixelSize({ width: 1920, height: 1080 }, { width: 1, height: 1 })).toBe(64);
  });

  it('converts a pixel size back into an aspect-correct grid', () => {
    expect(gridFromPixelSize({ width: 4000, height: 2000 }, 10)).toEqual({ width: 400, height: 200 });
  });

  it('caps the grid when pixel size is extremely small', () => {
    const grid = gridFromPixelSize({ width: 8192, height: 4096 }, 1);
    expect(grid.width).toBe(MAX_GRID);
    expect(grid.height).toBe(MAX_GRID / 2);
  });
});

describe('output and export dimensions', () => {
  it('auto-sizes output with an integer scale near 768 px', () => {
    expect(computeAutoOutput({ width: 64, height: 36 })).toEqual({ width: 768, height: 432 });
    expect(computeAutoOutput({ width: 256, height: 128 })).toEqual({ width: 768, height: 384 });
  });

  it('multiplies output dimensions by the export scale', () => {
    expect(computeExportSize({ width: 640, height: 360 }, 4)).toEqual({ width: 2560, height: 1440 });
  });

  it('links dimensions by aspect ratio and clamps to the maximum', () => {
    expect(linkHeight(1280, 16 / 9)).toBe(720);
    expect(linkWidth(720, 16 / 9)).toBe(1280);
    expect(linkHeight(MAX_OUTPUT_DIMENSION, 16 / 9)).toBeLessThanOrEqual(MAX_OUTPUT_DIMENSION);
  });

  it('validates export dimensions', () => {
    expect(isExportSizeValid({ width: 100, height: 100 }, 16384)).toBe(true);
    expect(isExportSizeValid({ width: 0, height: 100 }, 16384)).toBe(false);
    expect(isExportSizeValid({ width: 100, height: 20000 }, 16384)).toBe(false);
    expect(isExportSizeValid({ width: Number.NaN, height: 100 }, 16384)).toBe(false);
  });
});
