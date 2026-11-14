import type { SourceImage, Theme } from '../../types';
import { BeeMark, MoonIcon, SunIcon } from '../icons';

interface AppHeaderProps {
  theme: Theme;
  source: SourceImage | null;
  onToggleTheme: () => void;
  onNewProject: () => void;
  onGoToLanding?: () => void;
}

export function ThemeToggle({ theme, onToggleTheme }: { theme?: Theme; onToggleTheme?: () => void }) {
  const activeTheme: Theme =
    theme ??
    ((typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light') as Theme);

  const handleClick = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    const next: Theme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
  };

  const label = activeTheme === 'dark' ? 'Dark theme on. Switch to light.' : 'Light theme on. Switch to dark.';

  return (
    <button
      type="button"
      className="icon-btn theme-btn"
      onClick={handleClick}
      aria-label={label}
      title={activeTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    >
      {activeTheme === 'dark' ? <SunIcon size={17} /> : <MoonIcon size={17} />}
    </button>
  );
}

export function AppHeader({
  theme,
  source,
  onToggleTheme,
  onNewProject,
  onGoToLanding,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div
        className={`brand${onGoToLanding ? ' brand-clickable' : ''}`}
        onClick={onGoToLanding}
        role={onGoToLanding ? 'button' : undefined}
        tabIndex={onGoToLanding ? 0 : undefined}
        onKeyDown={
          onGoToLanding
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onGoToLanding();
                }
              }
            : undefined
        }
        title={onGoToLanding ? 'Return to overview' : undefined}
      >
        <BeeMark size={26} className="brand-bee-svg" />
        <span className="wordmark">beexie</span>
      </div>

      {onGoToLanding ? (
        <button type="button" className="ghost-btn btn-overview" onClick={onGoToLanding}>
          Overview
        </button>
      ) : null}

      {source ? (
        <div className="project">
          <img className="project-thumb" src={source.url} alt="" draggable={false} />
          <span className="project-name" title={source.name}>
            {source.name}
          </span>
        </div>
      ) : null}

      <div className="header-actions">
        <button type="button" className="ghost-btn" onClick={onNewProject}>
          New project
        </button>
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
}
