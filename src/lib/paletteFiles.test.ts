import { describe, expect, it } from 'vitest';
import { MAX_CUSTOM_COLORS, PALETTE_PRESETS } from '../constants';
import { normalizeSlug, PaletteError, parseGpl, parseHex, parseLospec, parsePaletteFile, toGpl, toHex } from './paletteFiles';

describe('palette files', () => {
  it('parses .hex with blanks, hashes, case and junk', () => {
    expect(parseHex('FF0000\r\n\n#00ff00\nnot a color\n0000FFAA\n123\n')).toEqual(['#ff0000', '#00ff00']);
  });

  it('parses .gpl with header, name, comments and named rows', () => {
    const text = 'GIMP Palette\nName: Test\nColumns: 4\n# comment\n255   0   0\tRed\n  0 128 255 Sky blue\n300 0 0 bad\n';
    expect(parseGpl(text)).toEqual(['#ff0000', '#0080ff']);
  });

  it('rejects empty and wrong files', () => {
    expect(() => parseHex('hello\n')).toThrow(PaletteError);
    expect(() => parseGpl('JASC-PAL\n0100\n')).toThrow(PaletteError);
    expect(() => parseLospec({ error: 'nope' })).toThrow(PaletteError);
  });

  it('caps oversized palettes', () => {
    const text = Array.from({ length: 100 }, (_, i) => i.toString(16).padStart(6, '0')).join('\n');
    expect(parseHex(text)).toHaveLength(MAX_CUSTOM_COLORS);
  });

  it('round trips through .gpl and .hex', () => {
    const palette = PALETTE_PRESETS.find((p) => p.id === 'endesga32')!.colors;
    expect(parseGpl(toGpl(palette))).toEqual(palette);
    expect(parseHex(toHex(palette))).toEqual(palette);
    expect(parsePaletteFile('x.GPL', toGpl(palette))).toEqual(palette);
  });

  it('reads the Lospec JSON shape', () => {
    expect(parseLospec({ name: 'x', colors: ['1D2B53', 'zzz', 'ffffff'] })).toEqual(['#1d2b53', '#ffffff']);
  });

  it('normalizes slugs and urls', () => {
    expect(normalizeSlug(' PICO-8 ')).toBe('pico-8');
    expect(normalizeSlug('https://lospec.com/palette-list/endesga-32.json')).toBe('endesga-32');
    expect(normalizeSlug('dawn bringer 16')).toBe('dawn-bringer-16');
    expect(normalizeSlug('../etc')).toBeNull();
  });

  it('ships full built-in palettes', () => {
    const size = (id: string) => PALETTE_PRESETS.find((p) => p.id === id)?.colors.length;
    expect([size('pico8'), size('db16'), size('db32'), size('endesga32'), size('gameboy')]).toEqual([16, 16, 32, 32, 4]);
    for (const preset of PALETTE_PRESETS) expect(preset.colors.every((c) => /^#[0-9a-f]{6}$/.test(c))).toBe(true);
  });
});
