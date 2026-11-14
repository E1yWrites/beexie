export type ColorMode = 'original' | 'reduced' | 'grayscale' | 'monochrome' | 'custom';
export type DitherMode = 'floyd' | 'bayer';
export type RetroPresetId = '16bit-jrpg' | 'arcade-action' | '8bit-classic' | 'gameboy-dmg' | 'cyberpunk-1993';
export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type ScaleFactor = 1 | 2 | 4 | 8;
export type GridPreset = 8 | 16 | 32 | 64 | 128 | 256;
export type ResolutionMode = 'preset' | 'custom';
export type PreviewMode = 'original' | 'pixel' | 'compare';
export type Theme = 'light' | 'dark';
export type Stage = 'image' | 'grid' | 'color' | 'finish';
export type StageState = 'live' | 'visited' | 'ahead';

export interface GridSize {
  width: number;
  height: number;
}

/** Canvas-free RGBA pixel buffer. Structurally compatible with ImageData. */
export interface RgbaImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface SourceImage {
  bitmap: CanvasImageSource;
  width: number;
  height: number;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ConverterSettings {
  resolutionMode: ResolutionMode;
  preset: GridPreset;
  customGrid: GridSize;
  gridAspectLocked: boolean;
  colorMode: ColorMode;
  reducedColors: number;
  customPalette: string[];
  /** 0 disables posterisation, otherwise levels per channel. */
  quantization: number;
  dithering: boolean;
  ditherMode: DitherMode;
  gridOverlay: boolean;
  transparentBackground: boolean;
  backgroundColor: string;
  outputWidth: number;
  outputHeight: number;
  /** When true, output dimensions follow the grid. */
  outputAuto: boolean;
  outputAspectLocked: boolean;
  format: ExportFormat;
  scale: ScaleFactor;
  quality: number;
  retroPreset: RetroPresetId | null;
}

export interface ExportSize {
  width: number;
  height: number;
}

export interface ColorOptions {
  mode: ColorMode;
  reducedColors: number;
  customPalette: string[];
  quantization: number;
  dithering: boolean;
  ditherMode?: DitherMode;
  transparentBackground: boolean;
  backgroundColor: string;
  retroPreset?: RetroPresetId | null;
}

export interface ProcessedImage extends RgbaImage {
  palette: string[];
}
