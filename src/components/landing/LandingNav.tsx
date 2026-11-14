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

export const LandingNav: React.FC<LandingNavProps> = ({
  theme,
  onToggleTheme,
  onLaunchStudio,
  hasActiveProject,
  activeFilename,
}) => {
  return (
    <header className="landing-nav" role="banner">
      <div className="landing-nav-inner">
        <a href="#top" className="landing-brand" aria-label="beexie home">
          <BeeMark size={26} className="brand-bee-svg" />
          <span className="brand-wordmark">beexie</span>
        </a>

        <nav className="landing-nav-links" aria-label="Primary navigation">
          <a href="#demo" className="nav-link">
            Workbench
          </a>
          <a href="#features" className="nav-link">
            Pipeline
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>

        <div className="landing-nav-actions">
          {hasActiveProject ? (
            <button
              type="button"
              className="btn-return-project"
              onClick={onLaunchStudio}
              title={`Return to active session: ${activeFilename}`}
            >
              <span className="pulse-dot" aria-hidden="true" />
              <span>Resume</span>
            </button>
          ) : null}
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          <button
            type="button"
            className="btn-launch-atelier"
            onClick={onLaunchStudio}
          >
            <span>Open Studio</span>
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
