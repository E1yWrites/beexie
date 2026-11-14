import { FORMAT_META, MAX_EXPORT_DIMENSION } from '../constants';
import { isExportSizeValid } from './dimensions';
import { canvasToBlob, renderProcessedToCanvas } from './pixelate';
import type { ExportFormat, ExportSize, ProcessedImage } from '../types';

function safeBaseName(name: string): string {
  const withoutExtension = name.replace(/\.[^.]+$/, '');
  const cleaned = withoutExtension
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || 'image';
}

export function buildExportFilename(
  sourceName: string,
  gridWidth: number,
  gridHeight: number,
  extension: string,
): string {
  return `${safeBaseName(sourceName)}-pixel-${gridWidth}x${gridHeight}.${extension}`;
}

/** Hand a blob to the browser as a file download. */
export function saveBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2_000);
}

export interface DownloadOptions {
  processed: ProcessedImage;
  size: ExportSize;
  format: ExportFormat;
  quality: number;
  backgroundColor: string;
  transparent: boolean;
  sourceName: string;
}

export interface DownloadResult {
  filename: string;
  width: number;
  height: number;
  bytes: number;
}

export async function downloadPixelArt(options: DownloadOptions): Promise<DownloadResult> {
  const { processed, size, format, quality, backgroundColor, transparent, sourceName } = options;
  if (!isExportSizeValid(size, MAX_EXPORT_DIMENSION)) {
    throw new Error(`Export dimensions must be between 1 and ${MAX_EXPORT_DIMENSION} pixels.`);
  }

  const meta = FORMAT_META[format];
  const needsBackground = !transparent || format === 'jpeg';
  const canvas = renderProcessedToCanvas(
    processed,
    size.width,
    size.height,
    needsBackground ? backgroundColor : null,
  );

  const blob = await canvasToBlob(canvas, meta.mime, format === 'png' ? undefined : quality);
  const filename = buildExportFilename(sourceName, processed.width, processed.height, meta.extension);
  saveBlob(blob, filename);

  canvas.width = 0;
  canvas.height = 0;

  return { filename, width: size.width, height: size.height, bytes: blob.size };
}
