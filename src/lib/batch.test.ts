import { describe, expect, it } from 'vitest';
import { crc32, sheetLayout, zipStore } from './batch';

describe('batch', () => {
  it('crc32 matches the known check value', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });

  it('zipStore writes a valid structure', async () => {
    const data = new TextEncoder().encode('hello');
    const bytes = new Uint8Array(await zipStore([{ name: 'a.txt', data }]).arrayBuffer());
    const view = new DataView(bytes.buffer);
    expect(view.getUint32(0, true)).toBe(0x04034b50);
    expect(view.getUint32(bytes.length - 22, true)).toBe(0x06054b50);
    expect(view.getUint16(bytes.length - 12, true)).toBe(1);
    expect(view.getUint32(bytes.length - 6, true)).toBe(30 + 5 + 5); // central dir offset
  });

  it('sheetLayout tiles into a near-square grid of max-size cells', () => {
    const l = sheetLayout([{ width: 4, height: 4 }, { width: 8, height: 2 }, { width: 2, height: 6 }]);
    expect(l).toMatchObject({ cols: 2, rows: 2, cellW: 8, cellH: 6, width: 16, height: 12 });
  });
});
