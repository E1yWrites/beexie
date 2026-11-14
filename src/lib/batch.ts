import { FORMAT_META } from '../constants';
import { computeAutoOutput, computeExportSize, computeGrid } from './dimensions';
import { buildExportFilename, encodeExport } from './export';
import { loadSourceImage, releaseSource } from './image';
import { canvasToBlob, renderProcessedToCanvas } from './pixelate';
import { processImage } from './pipelineClient';
import type { ConverterSettings } from '../types';

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of data) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Store-only zip (no compression): outputs are already-compressed images. ponytail: no zip64, caps at 4 GB / 65535 files. */
export function zipStore(files: { name: string; data: Uint8Array }[]): Blob {
  const parts: BlobPart[] = [];
  const central: Uint8Array[] = [];
  const text = new TextEncoder();
  let offset = 0;

  for (const file of files) {
    const name = text.encode(file.name);
    const crc = crc32(file.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 names
    local.setUint32(14, crc, true);
    local.setUint32(18, file.data.length, true);
    local.setUint32(22, file.data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(local.buffer, name, file.data as BlobPart);

    const entry = new DataView(new ArrayBuffer(46));
    entry.setUint32(0, 0x02014b50, true);
    entry.setUint16(4, 20, true);
    entry.setUint16(6, 20, true);
    entry.setUint16(8, 0x0800, true);
    entry.setUint32(16, crc, true);
    entry.setUint32(20, file.data.length, true);
    entry.setUint32(24, file.data.length, true);
    entry.setUint16(28, name.length, true);
    entry.setUint32(42, offset, true);
    central.push(new Uint8Array(entry.buffer), name);
    offset += 30 + name.length + file.data.length;
  }

  const size = central.reduce((sum, chunk) => sum + chunk.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, size, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central as BlobPart[], end.buffer], { type: 'application/zip' });
}

/** Tile same-or-smaller canvases left-to-right into cols columns; cells are the largest frame. */
export function sheetLayout(sizes: { width: number; height: number }[], cols = Math.ceil(Math.sqrt(sizes.length))) {
  const cellW = Math.max(...sizes.map((s) => s.width));
  const cellH = Math.max(...sizes.map((s) => s.height));
  const rows = Math.ceil(sizes.length / cols);
  return { cols, rows, cellW, cellH, width: cols * cellW, height: rows * cellH };
}

export interface BatchResult {
  blob: Blob;
  converted: number;
  skipped: string[];
}

/** Convert every file with the current settings; zip contains each image plus sheet.png. */
export async function convertBatch(
  files: File[],
  settings: ConverterSettings,
  onProgress?: (done: number, total: number) => void,
): Promise<BatchResult> {
  const meta = FORMAT_META[settings.format];
  const out: { name: string; data: Uint8Array }[] = [];
  const frames: HTMLCanvasElement[] = [];
  const skipped: string[] = [];
  const used = new Set<string>();

  for (const [index, file] of files.entries()) {
    try {
      const source = await loadSourceImage(file);
      try {
        const grid = computeGrid(source, settings);
        const processed = await processImage(source, grid, settings);
        const size = computeExportSize(computeAutoOutput(grid), settings.scale);
        const blob = await encodeExport(processed, size, settings.format, settings.quality, settings.backgroundColor, settings.transparentBackground);
        // The sheet stays a PNG raster whatever the per-image format.
        const needsBg = !settings.transparentBackground || settings.format === 'jpeg';
        const canvas = renderProcessedToCanvas(processed, size.width, size.height, needsBg ? settings.backgroundColor : null);
        let name = buildExportFilename(source.name, grid.width, grid.height, meta.extension);
        for (let n = 2; used.has(name); n += 1) name = name.replace(/(\.\w+)$/, `-${n}$1`);
        used.add(name);
        out.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
        frames.push(canvas);
      } finally {
        releaseSource(source);
      }
    } catch {
      skipped.push(file.name);
    }
    onProgress?.(index + 1, files.length);
  }

  if (frames.length === 0) throw new Error('None of those files could be converted.');

  const layout = sheetLayout(frames);
  const sheet = document.createElement('canvas');
  sheet.width = layout.width;
  sheet.height = layout.height;
  const context = sheet.getContext('2d')!;
  frames.forEach((frame, i) => context.drawImage(frame, (i % layout.cols) * layout.cellW, Math.floor(i / layout.cols) * layout.cellH));
  const sheetBlob = await canvasToBlob(sheet, 'image/png');
  out.push({ name: 'sheet.png', data: new Uint8Array(await sheetBlob.arrayBuffer()) });

  return { blob: zipStore(out), converted: frames.length, skipped };
}
