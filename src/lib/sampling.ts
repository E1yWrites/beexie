import type { RgbaImage, SamplingMode } from '../types';

/** Cell bounds along one axis; every cell covers at least one source pixel. */
function span(cell: number, cells: number, size: number): [number, number] {
  const start = Math.min(size - 1, Math.floor((cell * size) / cells));
  const end = Math.max(start + 1, Math.min(size, Math.floor(((cell + 1) * size) / cells)));
  return [start, end];
}

interface Bucket {
  count: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Reduce a source buffer to a grid, one color per cell.
 * mode: most frequent color (5 bits per channel buckets, returned as the bucket's true average;
 * ties go to the bucket closest to the cell average). median: per-channel median.
 */
export function sampleCells(
  source: RgbaImage,
  gridWidth: number,
  gridHeight: number,
  method: Exclude<SamplingMode, 'average'>,
): RgbaImage {
  const out = new Uint8ClampedArray(gridWidth * gridHeight * 4);
  const src = source.data;
  const histogram = new Uint32Array(256 * 4);

  for (let cy = 0; cy < gridHeight; cy += 1) {
    const [y0, y1] = span(cy, gridHeight, source.height);
    for (let cx = 0; cx < gridWidth; cx += 1) {
      const [x0, x1] = span(cx, gridWidth, source.width);
      const o = (cy * gridWidth + cx) * 4;
      const total = (x1 - x0) * (y1 - y0);

      if (method === 'median') {
        histogram.fill(0);
        for (let y = y0; y < y1; y += 1) {
          for (let x = x0; x < x1; x += 1) {
            const i = (y * source.width + x) * 4;
            histogram[src[i]] += 1;
            histogram[256 + src[i + 1]] += 1;
            histogram[512 + src[i + 2]] += 1;
            histogram[768 + src[i + 3]] += 1;
          }
        }
        const half = Math.floor((total - 1) / 2);
        for (let c = 0; c < 4; c += 1) {
          let seen = 0;
          let v = 0;
          while (v < 255 && seen + histogram[c * 256 + v] <= half) {
            seen += histogram[c * 256 + v];
            v += 1;
          }
          out[o + c] = v;
        }
        continue;
      }

      const buckets = new Map<number, Bucket>();
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let sa = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          const i = (y * source.width + x) * 4;
          const r = src[i];
          const g = src[i + 1];
          const b = src[i + 2];
          const a = src[i + 3];
          sr += r;
          sg += g;
          sb += b;
          sa += a;
          const key = ((r >> 3) << 15) | ((g >> 3) << 10) | ((b >> 3) << 5) | (a >> 3);
          const bucket = buckets.get(key);
          if (bucket) {
            bucket.count += 1;
            bucket.r += r;
            bucket.g += g;
            bucket.b += b;
            bucket.a += a;
          } else {
            buckets.set(key, { count: 1, r, g, b, a });
          }
        }
      }

      const ar = sr / total;
      const ag = sg / total;
      const ab = sb / total;
      const aa = sa / total;
      let best: Bucket | null = null;
      let bestDistance = Infinity;
      for (const bucket of buckets.values()) {
        const dr = bucket.r / bucket.count - ar;
        const dg = bucket.g / bucket.count - ag;
        const db = bucket.b / bucket.count - ab;
        const da = bucket.a / bucket.count - aa;
        const distance = dr * dr + dg * dg + db * db + da * da;
        if (!best || bucket.count > best.count || (bucket.count === best.count && distance < bestDistance)) {
          best = bucket;
          bestDistance = distance;
        }
      }
      out[o] = Math.round(best!.r / best!.count);
      out[o + 1] = Math.round(best!.g / best!.count);
      out[o + 2] = Math.round(best!.b / best!.count);
      out[o + 3] = Math.round(best!.a / best!.count);
    }
  }

  return { width: gridWidth, height: gridHeight, data: out };
}
