import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Theme } from '../types';

const STORAGE_KEY = 'beexie-theme';
const LEGACY_KEY = 'lanzos-pixel-theme';

const THEME_COLOR: Record<Theme, string> = {
  light: '#ffffff',
  dark: '#1d1e22',
};

function initialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    if (stored === 'dark') return 'dark';
  } catch {
    // Storage can be unavailable in private/locked-down contexts.
  }
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLOR[theme];
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Persisting is best-effort.
    }
  }, [theme]);

  // C10: the new theme wipes down the page in steps (View Transitions); instant where unsupported or reduced.
  const toggleTheme = useCallback(() => {
    const flip = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown };
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      flip();
      return;
    }
    doc.startViewTransition(() => flushSync(flip));
  }, []);

  return { theme, toggleTheme, setTheme } as const;
}
