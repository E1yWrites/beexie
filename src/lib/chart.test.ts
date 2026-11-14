import { describe, expect, it } from 'vitest';
import { MAX_EXPORT_DIMENSION } from '../constants';
import { CHART_SYMBOLS, chartLayout, countColors } from './chart';

describe('maker chart', () => {
  it('counts opaque pixels per color, most used first', () => {
    const px = (r: number, g: number, b: number, a = 255) => [r, g, b, a];
    const data = new Uint8ClampedArray([
      ...px(255, 0, 0), ...px(0, 0, 255), ...px(0, 0, 255),
      ...px(0, 0, 0, 0), ...px(0, 0, 255), ...px(255, 0, 0),
    ]);
    const counts = countColors({ width: 3, height: 2, data });
    expect(counts).toEqual([
      { color: '#0000ff', count: 3, symbol: 'A' },
      { color: '#ff0000', count: 2, symbol: 'B' },
    ]);
    expect(counts.reduce((s, c) => s + c.count, 0)).toBe(5);
  });

  it('has 48 distinct symbols', () => {
    expect(new Set(CHART_SYMBOLS).size).toBe(48);
  });

  it('lays out a 32 grid at 24 px cells with room for the legend', () => {
    const layout = chartLayout(32, 16, 10);
    expect(layout.cell).toBe(24);
    expect(layout.width).toBe(24 + 32 + 32 * 24 + 24);
    expect(layout.legendColumns).toBe(3);
    expect(layout.height).toBe(56 + 16 * 24 + 24 + 44 + 4 * 28 + 24);
  });

  it('shrinks cells for big grids and stays under the export cap', () => {
    const layout = chartLayout(1024, 1024, 64);
    expect(layout.cell).toBeLessThan(24);
    expect(layout.width).toBeLessThanOrEqual(MAX_EXPORT_DIMENSION);
    expect(layout.height).toBeLessThanOrEqual(MAX_EXPORT_DIMENSION);
    expect(layout.symbols).toBe(layout.cell >= 10);
  });
});
