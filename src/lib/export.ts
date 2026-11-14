import { FORMAT_META, MAX_EXPORT_DIMENSION } from '../constants';
import { isExportSizeValid } from './dimensions';
import { canvasToBlob, renderProcessedToCanvas } from './pixelate';
import { processedToSvg } from './svg';
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

/** Encode the processed grid at the final size. Raster formats render nearest-neighbor; SVG stays vector. */
export async function encodeExport(
  processed: ProcessedImage,
  size: ExportSize,
  format: ExportFormat,
  quality: number,
  backgroundColor: string,
  transparent: boolean,
): Promise<Blob> {
  const needsBackground = !transparent || format === 'jpeg';
  const background = needsBackground ? backgroundColor : null;
  if (format === 'svg') {
    return new Blob([processedToSvg(processed, size.width, size.height, background)], { type: FORMAT_META.svg.mime });
  }
  const canvas = renderProcessedToCanvas(processed, size.width, size.height, background);
  try {
    return await canvasToBlob(canvas, FORMAT_META[format].mime, format === 'png' ? undefined : quality);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
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

  const blob = await encodeExport(processed, size, format, quality, backgroundColor, transparent);
  const filename = buildExportFilename(sourceName, processed.width, processed.height, FORMAT_META[format].extension);
  saveBlob(blob, filename);

  return { filename, width: size.width, height: size.height, bytes: blob.size };
}
