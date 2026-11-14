import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../constants';
import { stageAriaLabel, STAGE_ORDER, stageMeta, stageState } from './stages';

const source = {
  bitmap: {} as CanvasImageSource,
  width: 4032,
  height: 3024,
  name: 'sunflower-bee.jpg',
  type: 'image/jpeg',
  size: 1024,
  url: 'blob:test',
};

const grid = { width: 64, height: 48 };

describe('stage model', () => {
  it('orders the four stages', () => {
    expect(STAGE_ORDER).toEqual(['image', 'grid', 'color', 'finish']);
  });

  it('derives live sub-lines from state', () => {
    const settings = { ...DEFAULT_SETTINGS, preset: 64 as const };
    expect(stageMeta('image', { source, grid, settings, paletteSize: 0 })).toBe('4032 × 3024');
    expect(stageMeta('image', { source: null, grid, settings, paletteSize: 0 })).toBe('No image');
    expect(stageMeta('grid', { source, grid, settings, paletteSize: 0 })).toBe('64 × 48');
    expect(stageMeta('color', { source, grid, settings, paletteSize: 0 })).toBe('Original');
    expect(stageMeta('finish', { source, grid, settings, paletteSize: 0 })).toBe('PNG · 1×');
  });

  it('reports the real palette count when available', () => {
    const settings = { ...DEFAULT_SETTINGS, colorMode: 'reduced' as const, reducedColors: 16 };
    expect(stageMeta('color', { source, grid, settings, paletteSize: 14 })).toBe('14 colors');
    expect(stageMeta('color', { source, grid, settings, paletteSize: 0 })).toBe('16 colors');
  });

  it('handles the other colour modes', () => {
    const base = { source, grid, paletteSize: 0 };
    expect(stageMeta('color', { ...base, settings: { ...DEFAULT_SETTINGS, colorMode: 'grayscale' } })).toBe('Grayscale');
    expect(stageMeta('color', { ...base, settings: { ...DEFAULT_SETTINGS, colorMode: 'monochrome' } })).toBe('1-bit');
    expect(stageMeta('color', { ...base, settings: { ...DEFAULT_SETTINGS, colorMode: 'custom' } })).toBe(
      `${DEFAULT_SETTINGS.customPalette.length} colors`,
    );
  });

  it('marks live, visited and ahead stages', () => {
    const visited = new Set(['image', 'grid'] as const);
    expect(stageState('grid', 'grid', visited)).toBe('live');
    expect(stageState('image', 'grid', visited)).toBe('visited');
    expect(stageState('color', 'grid', visited)).toBe('ahead');
  });

  it('builds an accessible stop name', () => {
    expect(stageAriaLabel('color', 'live', '16 colors')).toBe('Color, live stage, 16 colors');
    expect(stageAriaLabel('grid', 'visited', '64 × 48')).toBe('Grid, visited, 64 × 48');
  });
});
