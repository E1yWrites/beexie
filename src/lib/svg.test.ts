import { describe, expect, it } from 'vitest';
import { processedToSvg } from './svg';

const R = [255, 0, 0, 255];
const B = [0, 0, 255, 255];
const T = [0, 0, 0, 0];
const H = [0, 0, 255, 128];

const image = (rows: number[][][]) => ({
  width: rows[0].length,
  height: rows.length,
  data: new Uint8ClampedArray(rows.flat(2)),
});

describe('processedToSvg', () => {
  it('emits one rect per run, skips transparency, keeps alpha', () => {
    const svg = processedToSvg(image([[R, R, B, T], [T, H, H, R]]), 40, 20, null);
    expect(svg).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 4 2" shape-rendering="crispEdges">' +
        '<rect x="0" y="0" width="2" height="1" fill="#ff0000"/>' +
        '<rect x="2" y="0" width="1" height="1" fill="#0000ff"/>' +
        '<rect x="1" y="1" width="2" height="1" fill="#0000ff" fill-opacity="0.502"/>' +
        '<rect x="3" y="1" width="1" height="1" fill="#ff0000"/>' +
        '</svg>\n',
    );
  });

  it('merges a flat row into one rect and puts the background first', () => {
    const svg = processedToSvg(image([[B, B, B, B, B, B, B, B]]), 8, 1, '#ffffff');
    expect(svg.match(/<rect/g)).toHaveLength(2);
    expect(svg).toContain('<rect width="8" height="1" fill="#ffffff"/><rect x="0" y="0" width="8"');
  });
});
