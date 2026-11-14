import { MAX_CUSTOM_COLORS } from '../constants';

const HEX6 = /^#?([0-9a-f]{6})$/i;

export class PaletteError extends Error {}

function finish(colors: string[]): string[] {
  if (colors.length === 0) throw new PaletteError('No colors found in that palette.');
  return colors.slice(0, MAX_CUSTOM_COLORS);
}

const byte = (value: string) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 255 ? n.toString(16).padStart(2, '0') : null;
};

/** `.hex`: one rrggbb per line, optional leading #. Other lines are skipped. */
export function parseHex(text: string): string[] {
  const colors: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.trim().match(HEX6);
    if (match) colors.push(`#${match[1].toLowerCase()}`);
  }
  return finish(colors);
}

/** GIMP `.gpl`: header, then `R G B [name]` rows; `#` comments and `Name:` / `Columns:` lines are skipped. */
export function parseGpl(text: string): string[] {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== 'GIMP Palette') throw new PaletteError('Not a GIMP palette file.');
  const colors: string[] = [];
  for (const line of lines.slice(1)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 3) continue;
    const [r, g, b] = parts.map(byte);
    if (r && g && b) colors.push(`#${r}${g}${b}`);
  }
  return finish(colors);
}

/** Lospec `palette-list/<slug>.json` body: `{ colors: ['rrggbb', ...] }`. */
export function parseLospec(json: unknown): string[] {
  const colors = (json as { colors?: unknown })?.colors;
  if (!Array.isArray(colors)) throw new PaletteError('Lospec did not return a palette.');
  return finish(colors.flatMap((c) => (typeof c === 'string' && HEX6.test(c) ? [`#${c.replace('#', '').toLowerCase()}`] : [])));
}

export function parsePaletteFile(name: string, text: string): string[] {
  return /\.gpl$/i.test(name) ? parseGpl(text) : parseHex(text);
}

export function toHex(colors: readonly string[]): string {
  return colors.map((c) => c.replace('#', '').toLowerCase()).join('\n') + '\n';
}

export function toGpl(colors: readonly string[], name = 'beexie'): string {
  const rows = colors.map((c) => {
    const n = parseInt(c.replace('#', ''), 16);
    return `${(n >> 16) & 255}\t${(n >> 8) & 255}\t${n & 255}\t${c.toLowerCase()}`;
  });
  return ['GIMP Palette', `Name: ${name}`, '#', ...rows].join('\n') + '\n';
}

/** Lospec slugs are lowercase words joined by hyphens. */
export function normalizeSlug(input: string): string | null {
  const slug = input.trim().toLowerCase().replace(/^.*palette-list\//, '').replace(/\.json$/, '').replace(/\s+/g, '-');
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? slug : null;
}
