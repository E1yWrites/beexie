import { describe, expect, it } from 'vitest';
import {
  applyContourInk,
  applyNesTileDiscipline,
  applyPalette,
  applyToneGrade,
  extractPalette,
  nearestPaletteIndex,
  parseHexColor,
  posterizeImage,
  processColors,
  quantizeValue,
  rgbToHex,
} from './colors';
import { EXTENDED_NES_PALETTE, PC98_CYBERPUNK_PALETTE, RETRO_PRESETS } from '../constants';
import type { RgbaImage } from '../types';

function imageFromPixels(pixels: number[][], width: number, height: number): RgbaImage {
  const data = new Uint8ClampedArray(width * height * 4);
  pixels.forEach((pixel, index) => {
    data[index * 4] = pixel[0];
    data[index * 4 + 1] = pixel[1];
    data[index * 4 + 2] = pixel[2];
    data[index * 4 + 3] = pixel[3];
  });
  return { width, height, data };
}

function solid(width: number, height: number, pixel: number[]): RgbaImage {
  return imageFromPixels(Array.from({ length: width * height }, () => [...pixel]), width, height);
}

describe('colour parsing', () => {
  it('parses short and long hex colours', () => {
    expect(parseHexColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseHexColor('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHexColor('#nothex')).toBeNull();
  });

  it('serialises to six-digit hex', () => {
    expect(rgbToHex({ r: 255, g: 16, b: 0 })).toBe('#ff1000');
  });
});

describe('posterisation', () => {
  it('quantises channels to the requested levels', () => {
    expect(quantizeValue(100, 2)).toBe(0);
    expect(quantizeValue(200, 2)).toBe(255);
    expect(quantizeValue(0, 4)).toBe(0);
    expect(quantizeValue(255, 4)).toBe(255);
  });

  it('posterises every visible pixel', () => {
    const image = imageFromPixels(
      [
        [100, 100, 100, 255],
        [200, 200, 200, 255],
      ],
      2,
      1,
    );
    const result = posterizeImage(image, 2, false);
    expect(Array.from(result.data)).toEqual([0, 0, 0, 255, 255, 255, 255, 255]);
  });
});

describe('palette handling', () => {
  const palette = [
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 255, b: 255 },
  ];

  it('picks the nearest palette colour', () => {
    expect(nearestPaletteIndex(20, 20, 20, palette)).toBe(0);
    expect(nearestPaletteIndex(240, 240, 240, palette)).toBe(1);
  });

  it('maps pixels onto the exact palette', () => {
    const image = solid(2, 2, [90, 90, 90, 255]);
    const result = applyPalette(image, palette, false);
    for (let index = 0; index < result.data.length; index += 4) {
      expect([result.data[index], result.data[index + 1], result.data[index + 2]]).toEqual([0, 0, 0]);
    }
  });

  it('extracts at most the requested number of colours', () => {
    const image = imageFromPixels(
      [
        [255, 0, 0, 255],
        [0, 255, 0, 255],
        [0, 0, 255, 255],
        [255, 255, 0, 255],
      ],
      4,
      1,
    );
    const extracted = extractPalette(image, 2);
    expect(extracted.length).toBe(2);
    const hexes = new Set(extracted.map(rgbToHex));
    expect(hexes.size).toBe(extracted.length);
  });

  it('ignores fully transparent pixels when extracting palettes', () => {
    const image = imageFromPixels(
      [
        [255, 0, 0, 255],
        [0, 255, 0, 0],
      ],
      2,
      1,
    );
    expect(extractPalette(image, 8)).toHaveLength(1);
  });
});

describe('processColors', () => {
  const baseOptions = {
    mode: 'original' as const,
    reducedColors: 16,
    customPalette: ['#000000', '#ffffff'],
    quantization: 0,
    dithering: false,
    transparentBackground: false,
    backgroundColor: '#ffffff',
  };

  it('keeps original colours when no effects are selected', () => {
    const image = solid(1, 1, [12, 34, 56, 255]);
    const result = processColors(image, baseOptions);
    expect(Array.from(result.data)).toEqual([12, 34, 56, 255]);
    expect(result.palette).toEqual([]);
  });

  it('converts to grayscale', () => {
    const image = solid(1, 1, [255, 0, 0, 255]);
    const result = processColors(image, { ...baseOptions, mode: 'grayscale' });
    expect(result.data[0]).toBe(result.data[1]);
    expect(result.data[1]).toBe(result.data[2]);
  });

  it('converts to pure black and white in monochrome mode', () => {
    const image = imageFromPixels(
      [
        [10, 10, 10, 255],
        [240, 240, 240, 255],
      ],
      2,
      1,
    );
    const result = processColors(image, { ...baseOptions, mode: 'monochrome' });
    expect(Array.from(result.data)).toEqual([0, 0, 0, 255, 255, 255, 255, 255]);
    expect(result.palette).toEqual(['#000000', '#ffffff']);
  });

  it('preserves alpha when transparency is enabled', () => {
    const image = solid(1, 1, [10, 20, 30, 0]);
    const result = processColors(image, { ...baseOptions, transparentBackground: true });
    expect(result.data[3]).toBe(0);
  });

  it('composites transparency onto the background when disabled', () => {
    const image = solid(1, 1, [0, 0, 0, 0]);
    const result = processColors(image, { ...baseOptions, backgroundColor: '#ff0000' });
    expect(Array.from(result.data)).toEqual([255, 0, 0, 255]);
  });

  it('maps to a custom palette', () => {
    const image = imageFromPixels(
      [
        [200, 20, 20, 255],
        [20, 20, 200, 255],
      ],
      2,
      1,
    );
    const result = processColors(image, {
      ...baseOptions,
      mode: 'custom',
      customPalette: ['#ff0000', '#0000ff'],
    });
    expect(Array.from(result.data)).toEqual([255, 0, 0, 255, 0, 0, 255, 255]);
    expect(result.palette).toEqual(['#ff0000', '#0000ff']);
  });

  it('adds dithering artefacts for gradients mapped to a two-colour palette', () => {
    const pixels = Array.from({ length: 16 }, (_, index) => [index * 16, index * 16, index * 16, 255]);
    const image = imageFromPixels(pixels, 16, 1);
    const dithered = processColors(image, {
      ...baseOptions,
      mode: 'reduced',
      reducedColors: 2,
      dithering: true,
    });
    const values = new Set<number>();
    for (let index = 0; index < dithered.data.length; index += 4) values.add(dithered.data[index]);
    expect(values.size).toBeGreaterThan(1);
  });
});

describe('applyToneGrade', () => {
  it('modifies contrast around midpoint 128', () => {
    const image = imageFromPixels([
      [100, 100, 100, 255],
      [150, 150, 150, 255],
    ], 2, 1);
    const result = applyToneGrade(image, 1.5, 1.0);
    expect(result.data[0]).toBeLessThan(100);
    expect(result.data[4]).toBeGreaterThan(150);
  });

  it('desaturates to luminance when saturation is zero', () => {
    const image = solid(1, 1, [255, 0, 0, 255]);
    const result = applyToneGrade(image, 1.0, 0.0);
    expect(result.data[0]).toBe(result.data[1]);
    expect(result.data[1]).toBe(result.data[2]);
    expect(result.data[0]).toBeGreaterThan(0);
  });
});

describe('applyContourInk', () => {
  it('does not ink outer canvas boundary for solid image', () => {
    const image = solid(4, 4, [180, 180, 180, 255]);
    const result = applyContourInk(image, 0.5);
    expect(result.data[0]).toBe(180);
  });

  it('inks sharp interior luminance edge', () => {
    const image = imageFromPixels([
      [240, 240, 240, 255], [20, 20, 20, 255],
    ], 2, 1);
    const result = applyContourInk(image, 0.4);
    expect(result.data[0]).toBeLessThan(240);
  });

  it('stamps inkColor on silhouette against transparency', () => {
    const image = imageFromPixels([
      [200, 200, 200, 255], [0, 0, 0, 0],
    ], 2, 1);
    const result = applyContourInk(image, 0.8, { r: 20, g: 16, b: 28 });
    expect(result.data[0]).toBeLessThan(100);
  });
});

describe('applyNesTileDiscipline', () => {
  it('restricts each 8x8 block to at most 4 colors from master palette', () => {
    const master = EXTENDED_NES_PALETTE.map(parseHexColor).filter((c): c is { r: number; g: number; b: number } => c !== null);
    const pixels: number[][] = [];
    for (let i = 0; i < 64; i += 1) {
      const color = master[i % 8];
      pixels.push([color.r, color.g, color.b, 255]);
    }
    const image = imageFromPixels(pixels, 8, 8);
    const disciplined = applyNesTileDiscipline(image, master);

    const unique = new Set<string>();
    for (let i = 0; i < disciplined.data.length; i += 4) {
      unique.add(rgbToHex({ r: disciplined.data[i], g: disciplined.data[i + 1], b: disciplined.data[i + 2] }));
    }
    expect(unique.size).toBeLessThanOrEqual(4);
  });
});

describe('retro presets via processColors', () => {
  const testImage = imageFromPixels(
    Array.from({ length: 64 }, (_, i) => [(i * 37) % 256, (i * 73) % 256, (i * 109) % 256, 255]),
    8,
    8,
  );

  it('applies 16-Bit JRPG preset with 32-color reduced palette', () => {
    const preset = RETRO_PRESETS.find((p) => p.id === '16bit-jrpg')!;
    const result = processColors(testImage, {
      mode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      customPalette: [],
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
      transparentBackground: false,
      backgroundColor: '#ffffff',
      retroPreset: '16bit-jrpg',
    });
    expect(result.palette.length).toBeLessThanOrEqual(32);
  });

  it('applies Arcade Action preset with 16-level quantization and ink', () => {
    const preset = RETRO_PRESETS.find((p) => p.id === 'arcade-action')!;
    const result = processColors(testImage, {
      mode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      customPalette: [],
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
      transparentBackground: false,
      backgroundColor: '#ffffff',
      retroPreset: 'arcade-action',
    });
    expect(result.palette.length).toBeLessThanOrEqual(32);
  });

  it('applies 8-Bit Classic preset enforcing <= 4 colors per 8x8 tile', () => {
    const preset = RETRO_PRESETS.find((p) => p.id === '8bit-classic')!;
    const result = processColors(testImage, {
      mode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      customPalette: [...preset.settings.customPalette!],
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
      transparentBackground: false,
      backgroundColor: '#ffffff',
      retroPreset: '8bit-classic',
    });
    const unique = new Set<string>();
    for (let i = 0; i < result.data.length; i += 4) {
      unique.add(rgbToHex({ r: result.data[i], g: result.data[i + 1], b: result.data[i + 2] }));
    }
    expect(unique.size).toBeLessThanOrEqual(4);
  });

  it('applies Game Boy DMG preset strictly matching the 4 olive shades', () => {
    const preset = RETRO_PRESETS.find((p) => p.id === 'gameboy-dmg')!;
    const result = processColors(testImage, {
      mode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      customPalette: [...preset.settings.customPalette!],
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
      transparentBackground: false,
      backgroundColor: '#ffffff',
      retroPreset: 'gameboy-dmg',
    });
    const gbSet = new Set(preset.settings.customPalette);
    for (let i = 0; i < result.data.length; i += 4) {
      const hex = rgbToHex({ r: result.data[i], g: result.data[i + 1], b: result.data[i + 2] });
      expect(gbSet.has(hex)).toBe(true);
    }
  });

  it('applies Cyberpunk 1993 preset strictly matching PC-98 palette with Bayer dithering', () => {
    const preset = RETRO_PRESETS.find((p) => p.id === 'cyberpunk-1993')!;
    const result = processColors(testImage, {
      mode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      customPalette: [...preset.settings.customPalette!],
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
      transparentBackground: false,
      backgroundColor: '#ffffff',
      retroPreset: 'cyberpunk-1993',
    });
    const pc98Set = new Set(PC98_CYBERPUNK_PALETTE);
    for (let i = 0; i < result.data.length; i += 4) {
      const hex = rgbToHex({ r: result.data[i], g: result.data[i + 1], b: result.data[i + 2] });
      expect(pc98Set.has(hex)).toBe(true);
    }
  });

  it('uses Bayer dithering in custom palette mode when requested', () => {
    const gradient = imageFromPixels(
      Array.from({ length: 16 }, (_, i) => [i * 16, i * 16, i * 16, 255]),
      4,
      4,
    );
    const resultNoDither = processColors(gradient, {
      mode: 'custom',
      reducedColors: 2,
      customPalette: ['#000000', '#ffffff'],
      quantization: 0,
      dithering: false,
      ditherMode: 'bayer',
      transparentBackground: false,
      backgroundColor: '#ffffff',
    });
    const resultBayer = processColors(gradient, {
      mode: 'custom',
      reducedColors: 2,
      customPalette: ['#000000', '#ffffff'],
      quantization: 0,
      dithering: true,
      ditherMode: 'bayer',
      transparentBackground: false,
      backgroundColor: '#ffffff',
    });
    expect(Array.from(resultBayer.data)).not.toEqual(Array.from(resultNoDither.data));
  });
});
