import { describe, expect, it } from 'vitest';
import { ticketDisabledReason, ticketDownloadLabel, ticketHeader, ticketOutput } from './ticket';

describe('export ticket', () => {
  it('states format and scale', () => {
    expect(ticketHeader('png', 4)).toBe('PNG · 4×');
    expect(ticketHeader('jpeg', 1)).toBe('JPG · 1×');
    expect(ticketHeader('webp', 8)).toBe('WEBP · 8×');
  });

  it('states the exact output size', () => {
    expect(ticketOutput({ width: 256, height: 192 })).toBe('256 × 192 px');
  });

  it('labels the download with the format', () => {
    expect(ticketDownloadLabel('png')).toBe('Download PNG');
    expect(ticketDownloadLabel('jpeg')).toBe('Download JPG');
  });

  it('explains an empty bench', () => {
    expect(ticketDisabledReason({ hasImage: false, size: { width: 64, height: 64 } })).toBe(
      'No image on the bench yet.',
    );
  });

  it('explains an oversized export', () => {
    expect(ticketDisabledReason({ hasImage: true, size: { width: 20000, height: 192 } })).toBe(
      'Output exceeds 16 384 px. Lower the scale.',
    );
  });

  it('allows a valid export', () => {
    expect(ticketDisabledReason({ hasImage: true, size: { width: 256, height: 192 } })).toBeNull();
  });
});
