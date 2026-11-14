import React, { useState } from 'react';
import type { Theme } from '../../types';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingFaq } from './LandingFaq';
import { LandingFooter } from './LandingFooter';
import { LegalModal, type LegalTab } from './LegalModal';
import { BackgroundPaths } from '../ui/background-paths';

interface LandingPageProps {
  theme?: Theme;
  onToggleTheme?: () => void;
  onFileSelect: (file: File) => void;
  onLaunchStudio: () => void;
  hasActiveProject: boolean;
  activeFilename?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  onToggleTheme,
  onFileSelect,
  onLaunchStudio,
  hasActiveProject,
  activeFilename,
}) => {
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);

  return (
    <div className="landing-page-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <BackgroundPaths theme={theme} />
      <LandingNav
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLaunchStudio={onLaunchStudio}
        hasActiveProject={hasActiveProject}
        activeFilename={activeFilename}
      />
      <main id="main-content" className="landing-main-content">
        <LandingHero
          onFileSelect={onFileSelect}
          onLaunchStudio={onLaunchStudio}
        />
        <LandingFeatures onLaunchStudio={onLaunchStudio} />
        <LandingFaq />
      </main>
      <LandingFooter
        onLaunchStudio={onLaunchStudio}
        onOpenLegal={(tab) => setLegalTab(tab)}
      />
      <LegalModal
        activeTab={legalTab}
        onSelectTab={(tab) => setLegalTab(tab)}
        onClose={() => setLegalTab(null)}
      />
    </div>
  );
};
