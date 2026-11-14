import React from 'react';
import type { Theme } from '../../types';
import { ArrowRightIcon, BeeMark } from '../icons';
import { ThemeToggle } from '../shell/AppHeader';

interface LandingNavProps {
  theme?: Theme;
  onToggleTheme?: () => void;
  onLaunchStudio: () => void;
  hasActiveProject: boolean;
  activeFilename?: string;
}

/** Label band across the top of the cover. */
export const LandingNav: React.FC<LandingNavProps> = ({
  theme,
  onToggleTheme,
  onLaunchStudio,
  hasActiveProject,
  activeFilename,
}) => (
  <header className="band">
    <a href="#top" className="brand" aria-label="beexie, back to top">
      <BeeMark size={28} />
      <span className="brand-wordmark">beexie</span>
    </a>

    <nav className="band-links" aria-label="Sections">
      <a href="#how-to-play">How to play</a>
      <a href="#presets">Presets</a>
      <a href="#faq">FAQ</a>
    </nav>

    <div className="band-actions">
      <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      <button
        type="button"
        className="btn-primary band-cta"
        onClick={onLaunchStudio}
        title={hasActiveProject ? `Resume ${activeFilename}` : undefined}
      >
        {hasActiveProject ? 'Resume' : 'Open Studio'}
        <ArrowRightIcon size={16} />
      </button>
    </div>
  </header>
);
