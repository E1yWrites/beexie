import { MAX_GRID, MAX_OUTPUT_DIMENSION } from '../constants';
import type { ConverterSettings, ExportSize, GridSize, ScaleFactor } from '../types';

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampInteger(value: number, min: number, max: number): number {
  return Math.round(clamp(value, min, max));
}

export interface SourceDimensions {
  width: number;
  height: number;
}

/**
 * Presets apply to the longest side; the other side follows the source ratio.
 * Custom grids are used verbatim (already aspect-linked by the UI helpers).
 */
export function computeGrid(source: SourceDimensions | null, settings: ConverterSettings): GridSize {
  if (!source) {
    return {
      width: clampInteger(settings.customGrid.width, 1, MAX_GRID),
      height: clampInteger(settings.customGrid.height, 1, MAX_GRID),
    };
  }

  if (settings.resolutionMode === 'custom') {
    return {
      width: clampInteger(settings.customGrid.width, 1, MAX_GRID),
      height: clampInteger(settings.customGrid.height, 1, MAX_GRID),
    };
  }

  const longest = Math.max(source.width, source.height);
  const factor = settings.preset / longest;
  return {
    width: Math.max(1, Math.min(MAX_GRID, Math.round(source.width * factor))),
    height: Math.max(1, Math.min(MAX_GRID, Math.round(source.height * factor))),
  };
}

/** Source pixels merged into one art pixel, as shown by the pixel-size slider. */
export function derivedPixelSize(source: SourceDimensions, grid: GridSize): number {
  const longestSource = Math.max(source.width, source.height);
  const longestGrid = Math.max(1, grid.width, grid.height);
  return clampInteger(longestSource / longestGrid, 1, 64);
}

/** Grid to custom grid dimensions using the source aspect ratio. */
export function gridFromPixelSize(source: SourceDimensions, pixelSize: number): GridSize {
  const longest = Math.max(source.width, source.height);
  const target = clampInteger(longest / Math.max(1, pixelSize), 1, MAX_GRID);
  return {
    width: clampInteger((source.width / longest) * target, 1, MAX_GRID),
    height: clampInteger((source.height / longest) * target, 1, MAX_GRID),
  };
}

/**
 * Default output size: integer upscales of the grid, aiming for roughly 768 px
 * on the longest side so previews and default exports are comfortably visible.
 */
export function computeAutoOutput(grid: GridSize): GridSize {
  const longest = Math.max(1, grid.width, grid.height);
  const scale = clampInteger(768 / longest, 1, 16);
  return { width: grid.width * scale, height: grid.height * scale };
}

export function computeExportSize(output: GridSize, scale: ScaleFactor): ExportSize {
  return { width: output.width * scale, height: output.height * scale };
}

export function isExportSizeValid(size: ExportSize, max: number): boolean {
  return (
    Number.isFinite(size.width) &&
    Number.isFinite(size.height) &&
    size.width >= 1 &&
    size.height >= 1 &&
    size.width <= max &&
    size.height <= max
  );
}

/** Link a width to a height using the supplied aspect ratio (w / h). */
export function linkHeight(width: number, ratio: number, max = MAX_OUTPUT_DIMENSION): number {
  if (!Number.isFinite(ratio) || ratio <= 0) return MAX_GRID;
  return clampInteger(width / ratio, 1, max);
}

/** Link a height to a width using the supplied aspect ratio (w / h). */
export function linkWidth(height: number, ratio: number, max = MAX_OUTPUT_DIMENSION): number {
  if (!Number.isFinite(ratio) || ratio <= 0) return MAX_GRID;
  return clampInteger(height * ratio, 1, max);
}
