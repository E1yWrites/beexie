import {
  DEFAULT_SETTINGS,
  FORMAT_META,
  GRID_PRESETS,
  MAX_CUSTOM_COLORS,
  MAX_GRID,
  MAX_OUTPUT_DIMENSION,
  QUANTIZATION_LEVELS,
  RETRO_PRESETS,
  SCALE_FACTORS,
} from '../constants';
import type { ConverterSettings } from '../types';

type Check = (value: unknown) => boolean;

const oneOf = (values: readonly unknown[]): Check => (value) => values.includes(value);
const bool: Check = (value) => typeof value === 'boolean';
const int = (min: number, max: number): Check => (value) => Number.isInteger(value) && (value as number) >= min && (value as number) <= max;
const hex: Check = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

/** Record over every key, so a new setting cannot ship without a validator (tsc fails). */
const CHECKS: Record<keyof ConverterSettings, Check> = {
  resolutionMode: oneOf(['preset', 'custom']),
  preset: oneOf(GRID_PRESETS),
  customGrid: (v) => typeof v === 'object' && v !== null && int(1, MAX_GRID)((v as { width?: unknown }).width) && int(1, MAX_GRID)((v as { height?: unknown }).height),
  gridAspectLocked: bool,
  sampling: oneOf(['average', 'mode', 'median']),
  colorMode: oneOf(['original', 'reduced', 'grayscale', 'monochrome', 'custom']),
  reducedColors: int(2, 64),
  customPalette: (v) => Array.isArray(v) && v.length >= 2 && v.length <= MAX_CUSTOM_COLORS && v.every(hex),
  quantization: oneOf(QUANTIZATION_LEVELS),
  dithering: bool,
  ditherMode: oneOf(['floyd', 'bayer']),
  gridOverlay: bool,
  transparentBackground: bool,
  backgroundColor: hex,
  outputWidth: int(1, MAX_OUTPUT_DIMENSION),
  outputHeight: int(1, MAX_OUTPUT_DIMENSION),
  outputAuto: bool,
  outputAspectLocked: bool,
  format: oneOf(Object.keys(FORMAT_META)),
  scale: oneOf(SCALE_FACTORS),
  quality: (v) => typeof v === 'number' && v >= 0.1 && v <= 1,
  retroPreset: (v) => v === null || RETRO_PRESETS.some((preset) => preset.id === v),
};

/** Each valid field is kept; each bad or missing one falls back to its default. Unknown fields are dropped. */
export function parseSettings(input: unknown): { settings: ConverterSettings; rejected: string[] } {
  const record = typeof input === 'object' && input !== null && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
  const settings = structuredClone(DEFAULT_SETTINGS) as Record<keyof ConverterSettings, unknown>;
  const rejected: string[] = [];
  for (const key of Object.keys(CHECKS) as (keyof ConverterSettings)[]) {
    if (!(key in record)) continue;
    if (CHECKS[key](record[key])) settings[key] = structuredClone(record[key]);
    else rejected.push(key);
  }
  return { settings: settings as unknown as ConverterSettings, rejected };
}

export const LOOK_VERSION = 1;

export class LookError extends Error {}

export function toLook(settings: ConverterSettings): string {
  return JSON.stringify({ beexie: LOOK_VERSION, settings }, null, 2) + '\n';
}

/** A shared look file: `{ "beexie": 1, "settings": { ... } }`. */
export function parseLook(text: string): { settings: ConverterSettings; rejected: string[] } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new LookError('That file is not JSON.');
  }
  const look = json as { beexie?: unknown; settings?: unknown };
  if (typeof json !== 'object' || json === null || look.beexie !== LOOK_VERSION || typeof look.settings !== 'object') {
    throw new LookError('That is not a beexie look file.');
  }
  return parseSettings(look.settings);
}

export const SETTINGS_STORAGE_KEY = 'beexie-settings';

export function loadStoredSettings(): ConverterSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? parseSettings(JSON.parse(raw)).settings : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function storeSettings(settings: ConverterSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Blocked or full storage: settings simply are not remembered.
  }
}
