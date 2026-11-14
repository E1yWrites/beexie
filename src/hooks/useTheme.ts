import { useCallback, useEffect, useState } from 'react';
import type { Theme } from '../types';

const STORAGE_KEY = 'beexie-theme';
const LEGACY_KEY = 'lanzos-pixel-theme';

const THEME_COLOR: Record<Theme, string> = {
  light: '#f8f6f1',
  dark: '#12141a',
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

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme, setTheme } as const;
}
