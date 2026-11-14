import { FORMAT_META } from '../constants';
import type { ConverterSettings, GridSize, SourceImage, Stage, StageState } from '../types';

export const STAGE_ORDER: readonly Stage[] = ['image', 'grid', 'color', 'finish'] as const;

export const STAGE_LABELS: Record<Stage, string> = {
  image: 'Image',
  grid: 'Grid',
  color: 'Color',
  finish: 'Finish',
};

export interface StageMetaContext {
  source: SourceImage | null;
  grid: GridSize;
  settings: ConverterSettings;
  paletteSize: number;
}

/** The live monospace sub-line shown under a tool and on a pipeline stop. */
export function stageMeta(stage: Stage, { source, grid, settings, paletteSize }: StageMetaContext): string {
  switch (stage) {
    case 'image':
      return source ? `${source.width} × ${source.height}` : 'No image';
    case 'grid':
      return `${grid.width} × ${grid.height}`;
    case 'color': {
      if (settings.colorMode === 'original') return 'Original';
      if (settings.colorMode === 'grayscale') return 'Grayscale';
      if (settings.colorMode === 'monochrome') return '1-bit';
      const count =
        settings.colorMode === 'custom'
          ? settings.customPalette.length
          : paletteSize > 0
            ? paletteSize
            : settings.reducedColors;
      return `${count} color${count === 1 ? '' : 's'}`;
    }
    case 'finish':
      return `${FORMAT_META[settings.format].label} · ${settings.scale}×`;
    default:
      return '';
  }
}

export function stageState(stage: Stage, active: Stage, visited: ReadonlySet<Stage>): StageState {
  if (stage === active) return 'live';
  return visited.has(stage) ? 'visited' : 'ahead';
}

/** Accessible name for a route stop: "Color, live stage, 16 colors". */
export function stageAriaLabel(stage: Stage, state: StageState, meta: string): string {
  const stateLabel = state === 'live' ? 'live stage' : state === 'visited' ? 'visited' : 'not visited';
  return `${STAGE_LABELS[stage]}, ${stateLabel}, ${meta}`;
}
