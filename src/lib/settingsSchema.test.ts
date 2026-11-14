import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../constants';
import { LookError, parseLook, parseSettings, toLook } from './settingsSchema';

const look = (settings: unknown, beexie: unknown = 1) => JSON.stringify({ beexie, settings });

describe('settings schema', () => {
  it('round trips a full look', () => {
    const settings = { ...DEFAULT_SETTINGS, colorMode: 'custom' as const, customPalette: ['#000000', '#ffffff'], scale: 4 as const, format: 'svg' as const, sampling: 'mode' as const, retroPreset: '8bit-classic' as const };
    expect(parseLook(toLook(settings))).toEqual({ settings, rejected: [] });
  });

  it('falls back field by field and reports what it rejected', () => {
    const { settings, rejected } = parseSettings({
      preset: 33,
      scale: 3,
      customPalette: ['#fff'],
      customGrid: { width: 0, height: 10 },
      quality: 2,
      retroPreset: 'nope',
      format: 'gif',
      backgroundColor: 'red',
      dithering: 'yes',
      reducedColors: 8,
    });
    expect(settings).toEqual({ ...DEFAULT_SETTINGS, reducedColors: 8 });
    expect(rejected.sort()).toEqual(['backgroundColor', 'customGrid', 'customPalette', 'dithering', 'format', 'preset', 'quality', 'retroPreset', 'scale']);
  });

  it('drops unknown fields and survives junk', () => {
    expect(parseSettings({ evil: '<script>', __proto__: { x: 1 } }).settings).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings(null).settings).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings([1, 2]).settings).toEqual(DEFAULT_SETTINGS);
  });

  it('never shares arrays with the defaults or the input', () => {
    const input = { customPalette: ['#000000', '#ffffff'] };
    const { settings } = parseSettings(input);
    expect(settings.customPalette).not.toBe(input.customPalette);
    expect(parseSettings({}).settings.customPalette).not.toBe(DEFAULT_SETTINGS.customPalette);
  });

  it('rejects files that are not beexie looks', () => {
    expect(() => parseLook('not json')).toThrow(LookError);
    expect(() => parseLook(look({}, 2))).toThrow(LookError);
    expect(() => parseLook(JSON.stringify({ settings: {} }))).toThrow(LookError);
    expect(() => parseLook(look('x'))).toThrow(LookError);
  });
});
