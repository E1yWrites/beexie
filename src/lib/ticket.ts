import { FORMAT_META, MAX_EXPORT_DIMENSION } from '../constants';
import type { ExportFormat, ExportSize, ScaleFactor } from '../types';

export function ticketHeader(format: ExportFormat, scale: ScaleFactor): string {
  return `${FORMAT_META[format].label} · ${scale}×`;
}

export function ticketOutput(size: ExportSize): string {
  return `${size.width} × ${size.height} px`;
}

export function ticketDownloadLabel(format: ExportFormat): string {
  return `Download ${FORMAT_META[format].label}`;
}

export interface TicketGate {
  hasImage: boolean;
  size: ExportSize;
}

/** Why the download is unavailable, or null when it is ready. */
export function ticketDisabledReason({ hasImage, size }: TicketGate): string | null {
  if (!hasImage) return 'No image on the bench yet.';
  if (
    !Number.isFinite(size.width) ||
    !Number.isFinite(size.height) ||
    size.width < 1 ||
    size.height < 1 ||
    size.width > MAX_EXPORT_DIMENSION ||
    size.height > MAX_EXPORT_DIMENSION
  ) {
    return `Output exceeds ${MAX_EXPORT_DIMENSION.toLocaleString('en-US').replace(/,/g, ' ')} px. Lower the scale.`;
  }
  return null;
}
