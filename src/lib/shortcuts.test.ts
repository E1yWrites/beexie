import { describe, expect, it } from 'vitest';
import { isTypingTarget, matchShortcut, SHORTCUTS } from './shortcuts';

const key = (k: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {}) => ({
  key: k,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  ...mods,
});
const button = { tagName: 'BUTTON' };

describe('shortcuts', () => {
  it('maps every binding', () => {
    expect(matchShortcut(key('1'), button)).toEqual({ kind: 'stage', stage: 'image' });
    expect(matchShortcut(key('4'), button)).toEqual({ kind: 'stage', stage: 'finish' });
    expect(matchShortcut(key('O'), button)).toEqual({ kind: 'view', mode: 'original' });
    expect(matchShortcut(key('p'), button)).toEqual({ kind: 'view', mode: 'pixel' });
    expect(matchShortcut(key('c'), button)).toEqual({ kind: 'view', mode: 'compare' });
    expect(matchShortcut(key('+'), button)).toEqual({ kind: 'zoom', step: 1 });
    expect(matchShortcut(key('='), button)).toEqual({ kind: 'zoom', step: 1 });
    expect(matchShortcut(key('-'), button)).toEqual({ kind: 'zoom', step: -1 });
    expect(matchShortcut(key('0'), button)).toEqual({ kind: 'fit' });
    expect(matchShortcut(key('d'), button)).toEqual({ kind: 'download' });
    expect(matchShortcut(key('?'), null)).toEqual({ kind: 'help' });
    expect(matchShortcut(key('x'), button)).toBeNull();
  });

  it('never fires with modifiers, so browser shortcuts keep working', () => {
    expect(matchShortcut(key('d', { ctrlKey: true }), button)).toBeNull();
    expect(matchShortcut(key('0', { metaKey: true }), button)).toBeNull();
    expect(matchShortcut(key('1', { altKey: true }), button)).toBeNull();
  });

  it('ignores keys typed into fields', () => {
    expect(matchShortcut(key('1'), { tagName: 'INPUT', type: 'number' })).toBeNull();
    expect(matchShortcut(key('d'), { tagName: 'input', type: 'text' })).toBeNull();
    expect(matchShortcut(key('d'), { tagName: 'TEXTAREA' })).toBeNull();
    expect(matchShortcut(key('d'), { tagName: 'DIV', isContentEditable: true })).toBeNull();
    expect(isTypingTarget({ tagName: 'INPUT', type: 'checkbox' })).toBe(false);
    expect(matchShortcut(key('2'), { tagName: 'INPUT', type: 'checkbox' })).toEqual({ kind: 'stage', stage: 'grid' });
  });

  it('has no key bound twice', () => {
    const keys = SHORTCUTS.flatMap((s) => s.keys);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
