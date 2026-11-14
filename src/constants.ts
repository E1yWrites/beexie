import type {
  ColorMode,
  ConverterSettings,
  DitherMode,
  ExportFormat,
  GridPreset,
  RetroPresetId,
  ScaleFactor,
} from './types';

export const GRID_PRESETS: readonly GridPreset[] = [8, 16, 32, 64, 128, 256];
export const SCALE_FACTORS: readonly ScaleFactor[] = [1, 2, 4, 8];
export const QUANTIZATION_LEVELS = [0, 2, 4, 8, 16, 32, 64] as const;

export const MIN_GRID = 1;
export const MAX_GRID = 1024;
export const MAX_SOURCE_DIMENSION = 4096;
export const MAX_OUTPUT_DIMENSION = 8192;
export const MAX_EXPORT_DIMENSION = 16384;
export const MAX_FILE_BYTES = 30 * 1024 * 1024;
export const MIN_FILE_BYTES = 1;

export const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const ACCEPTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'] as const;
export const ACCEPT_ATTRIBUTE = '.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp';

export const FORMAT_META: Record<ExportFormat, { label: string; mime: string; extension: string }> = {
  png: { label: 'PNG', mime: 'image/png', extension: 'png' },
  jpeg: { label: 'JPG', mime: 'image/jpeg', extension: 'jpg' },
  webp: { label: 'WEBP', mime: 'image/webp', extension: 'webp' },
};

export const DEFAULT_PALETTE = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'];

export const PC98_CYBERPUNK_PALETTE: readonly string[] = [
  '#090a14', '#16142b', '#272145', '#423869',
  '#164966', '#217c8f', '#42cfca', '#b8ffee',
  '#4a1733', '#8a2050', '#d4356e', '#ff6e9c',
  '#6b2960', '#a6419e', '#f0b654', '#f6eef8',
];

export const EXTENDED_NES_PALETTE: readonly string[] = [
  '#000000', '#fcfcfc', '#bcbcbc', '#7c7c7c',
  '#a80020', '#f83800', '#fca044', '#f8b800',
  '#00a800', '#58d854', '#0058f8', '#3cbcfc',
  '#6844fc', '#d800cc', '#e40058', '#0078f8',
];

export interface RetroPresetMeta {
  id: RetroPresetId;
  name: string;
  era: string;
  description: string;
  settings: {
    colorMode: ColorMode;
    reducedColors: number;
    customPalette?: string[];
    quantization: number;
    dithering: boolean;
    ditherMode: DitherMode;
  };
  tuning: {
    contrast: number;
    saturation: number;
    contour: 'none' | 'soft' | 'bold';
    inkColor?: string;
    tileDiscipline?: boolean;
  };
}

export const RETRO_PRESETS: readonly RetroPresetMeta[] = [
  {
    id: '16bit-jrpg',
    name: '16-Bit JRPG',
    era: 'SNES 32c',
    description: 'SNES / Chrono-era aesthetic with vibrant 32-color shading and defined contours.',
    settings: {
      colorMode: 'reduced',
      reducedColors: 32,
      quantization: 32,
      dithering: false,
      ditherMode: 'floyd',
    },
    tuning: {
      contrast: 1.12,
      saturation: 1.25,
      contour: 'soft',
    },
  },
  {
    id: 'arcade-action',
    name: 'Arcade Action',
    era: 'CPS-2',
    description: 'Capcom CPS-2 punchy outlines and dynamic lighting.',
    settings: {
      colorMode: 'reduced',
      reducedColors: 32,
      quantization: 16,
      dithering: false,
      ditherMode: 'floyd',
    },
    tuning: {
      contrast: 1.35,
      saturation: 1.35,
      contour: 'bold',
      inkColor: '#14101c',
    },
  },
  {
    id: '8bit-classic',
    name: '8-Bit Classic',
    era: 'NES 4c/tile',
    description: 'NES / Famicom 4-color tile discipline with bold silhouettes.',
    settings: {
      colorMode: 'custom',
      reducedColors: 16,
      customPalette: [...EXTENDED_NES_PALETTE],
      quantization: 0,
      dithering: false,
      ditherMode: 'floyd',
    },
    tuning: {
      contrast: 1.2,
      saturation: 1.15,
      contour: 'bold',
      tileDiscipline: true,
    },
  },
  {
    id: 'gameboy-dmg',
    name: 'Game Boy DMG',
    era: 'DMG-01',
    description: 'Authentic 4-shade olive-green monochrome.',
    settings: {
      colorMode: 'custom',
      reducedColors: 4,
      customPalette: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
      quantization: 4,
      dithering: true,
      ditherMode: 'bayer',
    },
    tuning: {
      contrast: 1.15,
      saturation: 0,
      contour: 'soft',
    },
  },
  {
    id: 'cyberpunk-1993',
    name: 'Cyberpunk 1993',
    era: 'PC-98',
    description: 'High-contrast isometric PC-98 dithering.',
    settings: {
      colorMode: 'custom',
      reducedColors: 16,
      customPalette: [...PC98_CYBERPUNK_PALETTE],
      quantization: 16,
      dithering: true,
      ditherMode: 'bayer',
    },
    tuning: {
      contrast: 1.4,
      saturation: 1.2,
      contour: 'soft',
    },
  },
];

export interface PalettePreset {
  id: string;
  name: string;
  colors: string[];
}

export const PALETTE_PRESETS: PalettePreset[] = [
  { id: 'gameboy', name: 'Game Boy', colors: DEFAULT_PALETTE },
  { id: 'pico8', name: 'PICO-8', colors: ['#000000', '#1d2b53', '#7e2553', '#008751', '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8'] },
  { id: 'nes', name: 'NES', colors: ['#000000', '#fcfcfc', '#bcbcbc', '#7c7c7c', '#a80020', '#f83800', '#fca044', '#f8b800', '#00a800', '#58d854', '#0058f8', '#3cbcfc', '#6844fc', '#d800cc'] },
  { id: 'sweetie16', name: 'Sweetie 16', colors: ['#1a1c2c', '#5d275d', '#b13e53', '#ef7d57', '#ffcd75', '#a7f070', '#38b764', '#257179', '#29366f', '#3b5dc9', '#41a6f6', '#73eff7', '#f4f4f4', '#94b0c2', '#566c86', '#333c57'] },
  { id: 'cga', name: 'CGA', colors: ['#000000', '#55ffff', '#ff55ff', '#ffffff'] },
  { id: 'sepia', name: 'Sepia', colors: ['#2b1b0e', '#5c3a1e', '#a06a35', '#d9b382', '#f4e3c1'] },
  { id: 'grayscale', name: 'Gray 8', colors: ['#000000', '#242424', '#494949', '#6d6d6d', '#929292', '#b6b6b6', '#dbdbdb', '#ffffff'] },
];

export const DEFAULT_SETTINGS: ConverterSettings = {
  resolutionMode: 'preset',
  preset: 64,
  customGrid: { width: 64, height: 36 },
  gridAspectLocked: true,
  colorMode: 'original',
  reducedColors: 16,
  customPalette: [...DEFAULT_PALETTE],
  quantization: 0,
  dithering: false,
  ditherMode: 'floyd',
  gridOverlay: false,
  transparentBackground: false,
  backgroundColor: '#ffffff',
  outputWidth: 640,
  outputHeight: 640,
  outputAuto: true,
  outputAspectLocked: true,
  format: 'png',
  scale: 1,
  quality: 0.92,
  retroPreset: null,
};
