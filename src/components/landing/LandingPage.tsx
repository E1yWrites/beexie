import React, { useState } from 'react';
import type { Theme } from '../../types';
import { LandingFaq } from './LandingFaq';
import { LandingFeatures } from './LandingFeatures';
import { LandingFooter } from './LandingFooter';
import { LandingHero } from './LandingHero';
import { LandingNav } from './LandingNav';
import { LandingPresets } from './LandingPresets';
import { LandingPrivacy } from './LandingPrivacy';
import { LegalModal, type LegalTab } from './LegalModal';

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
    <div className="booklet">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <LandingNav
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLaunchStudio={onLaunchStudio}
        hasActiveProject={hasActiveProject}
        activeFilename={activeFilename}
      />
      <main id="main-content">
        <LandingHero onFileSelect={onFileSelect} onLaunchStudio={onLaunchStudio} />
        <LandingFeatures />
        <LandingPresets />
        <LandingPrivacy />
        <LandingFaq />
      </main>
      <LandingFooter onLaunchStudio={onLaunchStudio} onOpenLegal={setLegalTab} />
      <LegalModal activeTab={legalTab} onSelectTab={setLegalTab} onClose={() => setLegalTab(null)} />
    </div>
  );
};
