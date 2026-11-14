import { EXTENDED_NES_PALETTE, RETRO_PRESETS } from '../constants';
import type { ColorOptions, ProcessedImage, Rgb, RgbaImage } from '../types';

const ALPHA_THRESHOLD = 8;
const MAX_SAMPLES = 20_000;

export function clampByte(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function parseHexColor(input: string): Rgb | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function rgbToHex(color: Rgb): string {
  const value = (channel: number) => clampByte(channel).toString(16).padStart(2, '0');
  return `#${value(color.r)}${value(color.g)}${value(color.b)}`;
}

/** Rec. 709 relative luminance in sRGB space (sufficient for stylistic transfer). */
export function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function cloneImage(image: RgbaImage): RgbaImage {
  return {
    width: image.width,
    height: image.height,
    data: new Uint8ClampedArray(image.data),
  };
}

function compositeBackground(image: RgbaImage, background: Rgb): void {
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    if (alpha >= 1) {
      data[i + 3] = 255;
      continue;
    }
    data[i] = clampByte(data[i] * alpha + background.r * (1 - alpha));
    data[i + 1] = clampByte(data[i + 1] * alpha + background.g * (1 - alpha));
    data[i + 2] = clampByte(data[i + 2] * alpha + background.b * (1 - alpha));
    data[i + 3] = 255;
  }
}

export function quantizeValue(value: number, levels: number): number {
  const steps = Math.max(2, Math.round(levels));
  const clamped = Math.max(0, Math.min(255, value));
  return clampByte((Math.round((clamped / 255) * (steps - 1)) / (steps - 1)) * 255);
}

/** Weighted RGB distance: green matters most, blue least. */
export function nearestPaletteIndex(r: number, g: number, b: number, palette: Rgb[]): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < palette.length; i += 1) {
    const color = palette[i];
    const dr = r - color.r;
    const dg = g - color.g;
    const db = b - color.b;
    const distance = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  return bestIndex;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
/** Bayer 4x4 threshold in [-0.5, 0.5). */
function bayerBias(x: number, y: number): number {
  return (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 - 0.5;
}

function addError(buffer: Float32Array, width: number, height: number, x: number, y: number, channel: number, error: number): void {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  buffer[(y * width + x) * 3 + channel] += error;
}

function posterizeWithDithering(image: RgbaImage, levels: number, bayer: boolean): void {
  const { width, height, data } = image;
  const buffer = new Float32Array(width * height * 3);
  for (let i = 0, p = 0; i < width * height; i += 1, p += 4) {
    buffer[i * 3] = data[p];
    buffer[i * 3 + 1] = data[p + 1];
    buffer[i * 3 + 2] = data[p + 2];
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const pixel = index * 4;
      if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
      for (let channel = 0; channel < 3; channel += 1) {
        const spread = bayer ? (bayerBias(x, y) * 255) / (Math.max(2, levels) - 1) : 0;
        const value = Math.max(0, Math.min(255, buffer[index * 3 + channel] + spread));
        const quantized = quantizeValue(value, levels);
        data[pixel + channel] = quantized;
        if (bayer) continue;
        const error = value - quantized;
        addError(buffer, width, height, x + 1, y, channel, (error * 7) / 16);
        addError(buffer, width, height, x - 1, y + 1, channel, (error * 3) / 16);
        addError(buffer, width, height, x, y + 1, channel, (error * 5) / 16);
        addError(buffer, width, height, x + 1, y + 1, channel, (error * 1) / 16);
      }
    }
  }
}

export function posterizeImage(image: RgbaImage, levels: number, dither: boolean, bayer = false): RgbaImage {
  const out = cloneImage(image);
  if (levels <= 1) return out;
  if (dither) {
    posterizeWithDithering(out, levels, bayer);
    return out;
  }
  const { data } = out;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < ALPHA_THRESHOLD) continue;
    data[i] = quantizeValue(data[i], levels);
    data[i + 1] = quantizeValue(data[i + 1], levels);
    data[i + 2] = quantizeValue(data[i + 2], levels);
  }
  return out;
}

export function applyPalette(image: RgbaImage, palette: Rgb[], dither: boolean, bayer = false): RgbaImage {
  const out = cloneImage(image);
  if (palette.length === 0) return out;
  const { width, height, data } = out;

  if (!dither) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < ALPHA_THRESHOLD) continue;
      const color = palette[nearestPaletteIndex(data[i], data[i + 1], data[i + 2], palette)];
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
    }
    return out;
  }

  const buffer = new Float32Array(width * height * 3);
  for (let i = 0, p = 0; i < width * height; i += 1, p += 4) {
    buffer[i * 3] = data[p];
    buffer[i * 3 + 1] = data[p + 1];
    buffer[i * 3 + 2] = data[p + 2];
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const pixel = index * 4;
      if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
      const bias = bayer ? bayerBias(x, y) * 64 : 0;
      const r = Math.max(0, Math.min(255, buffer[index * 3] + bias));
      const g = Math.max(0, Math.min(255, buffer[index * 3 + 1] + bias));
      const b = Math.max(0, Math.min(255, buffer[index * 3 + 2] + bias));
      const color = palette[nearestPaletteIndex(r, g, b, palette)];
      data[pixel] = color.r;
      data[pixel + 1] = color.g;
      data[pixel + 2] = color.b;
      if (bayer) continue;
      const errors = [r - color.r, g - color.g, b - color.b];
      for (let channel = 0; channel < 3; channel += 1) {
        const error = errors[channel];
        addError(buffer, width, height, x + 1, y, channel, (error * 7) / 16);
        addError(buffer, width, height, x - 1, y + 1, channel, (error * 3) / 16);
        addError(buffer, width, height, x, y + 1, channel, (error * 5) / 16);
        addError(buffer, width, height, x + 1, y + 1, channel, (error * 1) / 16);
      }
    }
  }

  return out;
}

function grayscaleImage(image: RgbaImage): RgbaImage {
  const out = cloneImage(image);
  const { data } = out;
  for (let i = 0; i < data.length; i += 4) {
    const value = clampByte(luminance(data[i], data[i + 1], data[i + 2]));
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  return out;
}

function monochromeImage(image: RgbaImage): RgbaImage {
  const out = grayscaleImage(image);
  const { data } = out;
  for (let i = 0; i < data.length; i += 4) {
    const value = data[i] >= 128 ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  return out;
}

/**
 * Median-cut palette extraction over a bounded sample of visible pixels.
 * Returns at most `count` unique colours.
 */
export function extractPalette(image: RgbaImage, count: number): Rgb[] {
  const { width, height, data } = image;
  const total = width * height;
  const stride = Math.max(1, Math.floor(total / MAX_SAMPLES));
  const samples: Rgb[] = [];

  for (let i = 0; i < total; i += stride) {
    const pixel = i * 4;
    if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
    samples.push({ r: data[pixel], g: data[pixel + 1], b: data[pixel + 2] });
  }

  if (samples.length === 0) return [];
  const target = Math.max(1, Math.min(Math.round(count), samples.length));
  let boxes: Rgb[][] = [samples];

  while (boxes.length < target) {
    let bestIndex = -1;
    let bestRange = 0;
    let bestChannel: 'r' | 'g' | 'b' = 'r';

    for (let index = 0; index < boxes.length; index += 1) {
      const box = boxes[index];
      if (box.length < 2) continue;
      for (const channel of ['r', 'g', 'b'] as const) {
        let min = 255;
        let max = 0;
        for (const color of box) {
          const value = color[channel];
          if (value < min) min = value;
          if (value > max) max = value;
        }
        const range = max - min;
        if (range > bestRange) {
          bestRange = range;
          bestIndex = index;
          bestChannel = channel;
        }
      }
    }

    if (bestIndex === -1 || bestRange === 0) break;

    const box = boxes[bestIndex];
    box.sort((a, b) => a[bestChannel] - b[bestChannel]);
    const middle = Math.floor(box.length / 2);
    const left = box.slice(0, middle);
    const right = box.slice(middle);
    if (left.length === 0 || right.length === 0) break;
    boxes = [...boxes.slice(0, bestIndex), left, right, ...boxes.slice(bestIndex + 1)];
  }

  const palette: Rgb[] = [];
  const seen = new Set<string>();
  for (const box of boxes) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (const color of box) {
      r += color.r;
      g += color.g;
      b += color.b;
    }
    const average = {
      r: Math.round(r / box.length),
      g: Math.round(g / box.length),
      b: Math.round(b / box.length),
    };
    const hex = rgbToHex(average);
    if (!seen.has(hex)) {
      seen.add(hex);
      palette.push(average);
    }
  }
  return palette;
}

export function applyToneGrade(image: RgbaImage, contrast: number, saturation: number): RgbaImage {
  const out = cloneImage(image);
  const { data } = out;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < ALPHA_THRESHOLD) continue;
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (contrast !== 1) {
      r = clampByte(128 + (r - 128) * contrast);
      g = clampByte(128 + (g - 128) * contrast);
      b = clampByte(128 + (b - 128) * contrast);
    }

    if (saturation !== 1) {
      const lum = luminance(r, g, b);
      r = clampByte(lum + (r - lum) * saturation);
      g = clampByte(lum + (g - lum) * saturation);
      b = clampByte(lum + (b - lum) * saturation);
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  return out;
}

export function applyContourInk(
  image: RgbaImage,
  strength: number,
  inkColor?: Rgb | null,
): RgbaImage {
  const out = cloneImage(image);
  const { width, height, data } = image;
  const target = out.data;
  const threshold = 36;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (data[index + 3] < ALPHA_THRESHOLD) continue;

      const lum = luminance(data[index], data[index + 1], data[index + 2]);
      let isEdge = false;

      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          continue;
        }
        const nIndex = (ny * width + nx) * 4;
        if (data[nIndex + 3] < ALPHA_THRESHOLD) {
          isEdge = true;
          break;
        }
        const nLum = luminance(data[nIndex], data[nIndex + 1], data[nIndex + 2]);
        if (Math.abs(lum - nLum) > threshold) {
          isEdge = true;
          break;
        }
      }

      if (isEdge) {
        if (inkColor) {
          target[index] = clampByte(target[index] * (1 - strength) + inkColor.r * strength);
          target[index + 1] = clampByte(target[index + 1] * (1 - strength) + inkColor.g * strength);
          target[index + 2] = clampByte(target[index + 2] * (1 - strength) + inkColor.b * strength);
        } else {
          const factor = Math.max(0, 1 - strength);
          target[index] = clampByte(target[index] * factor);
          target[index + 1] = clampByte(target[index + 1] * factor);
          target[index + 2] = clampByte(target[index + 2] * factor);
        }
      }
    }
  }
  return out;
}

export function applyNesTileDiscipline(image: RgbaImage, masterPalette: Rgb[]): RgbaImage {
  const out = cloneImage(image);
  const { width, height, data } = out;

  for (let ty = 0; ty < height; ty += 8) {
    for (let tx = 0; tx < width; tx += 8) {
      const tileWidth = Math.min(8, width - tx);
      const tileHeight = Math.min(8, height - ty);

      const countMap = new Map<number, number>();
      for (let y = 0; y < tileHeight; y += 1) {
        for (let x = 0; x < tileWidth; x += 1) {
          const pixel = ((ty + y) * width + (tx + x)) * 4;
          if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
          const idx = nearestPaletteIndex(data[pixel], data[pixel + 1], data[pixel + 2], masterPalette);
          countMap.set(idx, (countMap.get(idx) ?? 0) + 1);
        }
      }

      if (countMap.size <= 4) continue;

      const topIndices = Array.from(countMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([idx]) => idx);
      const subPalette = topIndices.map((idx) => masterPalette[idx]);

      for (let y = 0; y < tileHeight; y += 1) {
        for (let x = 0; x < tileWidth; x += 1) {
          const pixel = ((ty + y) * width + (tx + x)) * 4;
          if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
          const chosen = subPalette[nearestPaletteIndex(data[pixel], data[pixel + 1], data[pixel + 2], subPalette)];
          data[pixel] = chosen.r;
          data[pixel + 1] = chosen.g;
          data[pixel + 2] = chosen.b;
        }
      }
    }
  }
  return out;
}

export function processColors(image: RgbaImage, options: ColorOptions): ProcessedImage {
  const out = cloneImage(image);

  if (!options.transparentBackground) {
    compositeBackground(out, parseHexColor(options.backgroundColor) ?? { r: 255, g: 255, b: 255 });
  }

  const preset = options.retroPreset ? RETRO_PRESETS.find((p) => p.id === options.retroPreset) : undefined;
  if (preset) {
    if (preset.tuning.contrast !== 1 || preset.tuning.saturation !== 1) {
      const graded = applyToneGrade(out, preset.tuning.contrast, preset.tuning.saturation);
      out.data.set(graded.data);
    }
    if (preset.tuning.contour !== 'none') {
      const strength = preset.tuning.contour === 'bold' ? 0.65 : 0.4;
      const ink = preset.tuning.inkColor ? parseHexColor(preset.tuning.inkColor) : null;
      const inked = applyContourInk(out, strength, ink);
      out.data.set(inked.data);
    }
  }

  const quantization = options.quantization;
  const bayer = options.ditherMode === 'bayer';

  let processed: ProcessedImage;

  switch (options.mode) {
    case 'monochrome': {
      const base = grayscaleImage(out);
      let result: RgbaImage;
      if (options.dithering) {
        result = applyPalette(base, [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }], true, bayer);
      } else {
        result = monochromeImage(out);
      }
      processed = { ...result, palette: ['#000000', '#ffffff'] };
      break;
    }
    case 'grayscale': {
      let result = grayscaleImage(out);
      if (quantization > 0) result = posterizeImage(result, quantization, options.dithering, bayer);
      processed = { ...result, palette: [] };
      break;
    }
    case 'reduced': {
      const prepared = quantization > 0 ? posterizeImage(out, quantization, false) : out;
      const colors = extractPalette(prepared, options.reducedColors);
      const result = applyPalette(prepared, colors, options.dithering, bayer);
      processed = { ...result, palette: colors.map(rgbToHex) };
      break;
    }
    case 'custom': {
      const colors = options.customPalette
        .map(parseHexColor)
        .filter((color): color is Rgb => color !== null);
      const prepared = quantization > 0 ? posterizeImage(out, quantization, false) : out;
      if (colors.length === 0) {
        processed = { ...prepared, palette: [] };
        break;
      }
      const result = applyPalette(prepared, colors, options.dithering, bayer);
      processed = { ...result, palette: colors.map(rgbToHex) };
      break;
    }
    case 'original':
    default: {
      const result = quantization > 0 ? posterizeImage(out, quantization, options.dithering, bayer) : out;
      processed = { ...result, palette: [] };
      break;
    }
  }

  if (preset?.tuning.tileDiscipline) {
    const nesMaster = EXTENDED_NES_PALETTE.map(parseHexColor).filter((c): c is Rgb => c !== null);
    const disciplined = applyNesTileDiscipline(processed, nesMaster);
    return { ...disciplined, palette: processed.palette };
  }

  return processed;
}
