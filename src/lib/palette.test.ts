import { describe, expect, it } from 'vitest';
import { paletteRows } from './palette';

const colors = (count: number) => Array.from({ length: count }, (_, index) => `#${index.toString(16).padStart(6, '0')}`);

describe('palette comb packing', () => {
  it('keeps a short palette on one row', () => {
    expect(paletteRows(colors(2))).toEqual([colors(2)]);
    expect(paletteRows(colors(8))).toHaveLength(1);
  });

  it('packs nine colours as eight plus one', () => {
    const rows = paletteRows(colors(9));
    expect(rows.map((row) => row.length)).toEqual([8, 1]);
  });

  it('packs sixteen and sixty-four colours exactly', () => {
    expect(paletteRows(colors(16)).map((row) => row.length)).toEqual([8, 8]);
    const rows = paletteRows(colors(64));
    expect(rows).toHaveLength(8);
    expect(rows.every((row) => row.length === 8)).toBe(true);
  });

  it('adapts to a narrower comb', () => {
    expect(paletteRows(colors(10), 6).map((row) => row.length)).toEqual([6, 4]);
    expect(paletteRows(colors(3), 0)).toEqual([[colors(3)[0]], [colors(3)[1]], [colors(3)[2]]]);
  });
});
