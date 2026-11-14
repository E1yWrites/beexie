import type { ColorOptions, ConverterSettings, GridSize, ProcessedImage } from '../types';
import { processColors } from './colors';
import { rasterizeToGrid } from './pixelate';

/** Every pixel-affecting setting feeds the pipeline through here, for the studio and for batch. */
export function colorOptions(settings: ConverterSettings): ColorOptions {
  return {
    mode: settings.colorMode,
    reducedColors: settings.reducedColors,
    customPalette: settings.customPalette,
    quantization: settings.quantization,
    dithering: settings.dithering,
    ditherMode: settings.ditherMode,
    transparentBackground: settings.transparentBackground,
    backgroundColor: settings.backgroundColor,
    retroPreset: settings.retroPreset,
  };
}

export function runPipeline(
  source: { bitmap: CanvasImageSource; width: number; height: number },
  grid: GridSize,
  settings: ConverterSettings,
): ProcessedImage {
  const raster = rasterizeToGrid(
    source.bitmap,
    source.width,
    source.height,
    grid.width,
    grid.height,
    settings.transparentBackground ? null : settings.backgroundColor,
    settings.sampling,
  );
  return processColors(raster, colorOptions(settings));
}
