import type { PreviewMode, Stage } from '../types';

export type ShortcutAction =
  | { kind: 'stage'; stage: Stage }
  | { kind: 'view'; mode: PreviewMode }
  | { kind: 'zoom'; step: 1 | -1 }
  | { kind: 'fit' }
  | { kind: 'download' }
  | { kind: 'help' };

export interface Shortcut {
  keys: string[];
  label: string;
  action: ShortcutAction;
}

/** One table drives both the key handler and the reference dialog. */
export const SHORTCUTS: readonly Shortcut[] = [
  { keys: ['1'], label: 'Image stage', action: { kind: 'stage', stage: 'image' } },
  { keys: ['2'], label: 'Grid stage', action: { kind: 'stage', stage: 'grid' } },
  { keys: ['3'], label: 'Color stage', action: { kind: 'stage', stage: 'color' } },
  { keys: ['4'], label: 'Finish stage', action: { kind: 'stage', stage: 'finish' } },
  { keys: ['o'], label: 'Show original', action: { kind: 'view', mode: 'original' } },
  { keys: ['p'], label: 'Show pixel art', action: { kind: 'view', mode: 'pixel' } },
  { keys: ['c'], label: 'Compare', action: { kind: 'view', mode: 'compare' } },
  { keys: ['+', '='], label: 'Zoom in', action: { kind: 'zoom', step: 1 } },
  { keys: ['-'], label: 'Zoom out', action: { kind: 'zoom', step: -1 } },
  { keys: ['0'], label: 'Fit to screen', action: { kind: 'fit' } },
  { keys: ['d'], label: 'Download', action: { kind: 'download' } },
  { keys: ['?'], label: 'Show these shortcuts', action: { kind: 'help' } },
];

const TEXT_INPUTS = new Set(['text', 'number', 'search', 'email', 'url', 'tel', 'password']);

export interface KeyLike {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface FocusLike {
  tagName: string;
  type?: string;
  isContentEditable?: boolean;
}

/** Where typing belongs to the field, a key is never a shortcut. */
export function isTypingTarget(target: FocusLike | null): boolean {
  if (!target) return false;
  const tag = target.tagName.toUpperCase();
  if (tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return true;
  return tag === 'INPUT' && TEXT_INPUTS.has((target.type ?? 'text').toLowerCase());
}

export function matchShortcut(event: KeyLike, target: FocusLike | null): ShortcutAction | null {
  if (event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(target)) return null;
  const key = event.key.toLowerCase();
  return SHORTCUTS.find((shortcut) => shortcut.keys.includes(key))?.action ?? null;
}

export const SHORTCUTS_STORAGE_KEY = 'beexie-shortcuts';

export function readShortcutsEnabled(): boolean {
  try {
    return window.localStorage.getItem(SHORTCUTS_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function writeShortcutsEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(SHORTCUTS_STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Storage can be blocked; the toggle still works for this visit.
  }
}
