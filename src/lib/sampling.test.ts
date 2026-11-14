import { describe, expect, it } from 'vitest';
import { sampleCells } from './sampling';

const RED = [216, 30, 40, 255];
const BLUE = [36, 73, 224, 255];

/** 12 x 12 image: left 7 columns red, right 5 blue, so a 2 x 2 grid straddles the edge. */
function edgeImage() {
  const data = new Uint8ClampedArray(12 * 12 * 4);
  for (let y = 0; y < 12; y += 1) {
    for (let x = 0; x < 12; x += 1) data.set(x < 7 ? RED : BLUE, (y * 12 + x) * 4);
  }
  return { width: 12, height: 12, data };
}

const colorsOf = (data: Uint8ClampedArray) => {
  const set = new Set<string>();
  for (let i = 0; i < data.length; i += 4) set.add(Array.from(data.slice(i, i + 4)).join(','));
  return set;
};

describe('sampleCells', () => {
  it('mode keeps only source colors at an edge', () => {
    const out = sampleCells(edgeImage(), 2, 2, 'mode');
    expect(colorsOf(out.data)).toEqual(new Set([RED.join(','), BLUE.join(',')]));
    // Right cell covers 1 red column and 5 blue: blue wins.
    expect(Array.from(out.data.slice(4, 8))).toEqual(BLUE);
  });

  it('median keeps only source colors at an edge', () => {
    const out = sampleCells(edgeImage(), 2, 2, 'median');
    expect(colorsOf(out.data)).toEqual(new Set([RED.join(','), BLUE.join(',')]));
  });

  it('mode breaks ties toward the cell average and is deterministic', () => {
    // Gray levels 200,205 | 100 | 0,5. Buckets {200,205} and {0,5} tie at 2; the cell average is 102,
    // so the dark bucket (mean 2.5) beats the light one (mean 202.5) even though the light one comes first.
    const levels = [200, 205, 100, 0, 5];
    const data = new Uint8ClampedArray(levels.flatMap((v) => [v, v, v, 255]));
    const image = { width: 5, height: 1, data };
    const a = sampleCells(image, 1, 1, 'mode');
    const b = sampleCells(image, 1, 1, 'mode');
    expect(a.data).toEqual(b.data);
    expect(Array.from(a.data)).toEqual([3, 3, 3, 255]);
  });

  it('handles grids larger than the source', () => {
    const out = sampleCells(edgeImage(), 24, 24, 'mode');
    expect(out.width).toBe(24);
    expect(colorsOf(out.data).size).toBe(2);
  });
});
