import React from 'react';
import { ArrowRightIcon, BeeMark } from '../icons';
import { VoxelPlate } from '../ui/VoxelPlate';
import type { LegalTab } from './LegalModal';

interface LandingFooterProps {
  onLaunchStudio: () => void;
  onOpenLegal: (tab: LegalTab) => void;
}

/** Back cover: one closing action and the colophon. */
export const LandingFooter: React.FC<LandingFooterProps> = ({ onLaunchStudio, onOpenLegal }) => (
  <footer className="backcover">
    <div className="backcover-plate">
      <VoxelPlate scene="dusk" />
      <h2 className="backcover-title">Your turn.</h2>
      <button type="button" className="cover-cta cover-cta-inverse" onClick={onLaunchStudio}>
        Open Studio
        <ArrowRightIcon size={18} />
      </button>
    </div>

    <div className="colophon">
      <span className="colophon-brand">
        <BeeMark size={22} />
        beexie
      </span>
      <span className="colophon-note">Runs entirely in your browser.</span>
      <nav className="colophon-links" aria-label="Privacy, terms, and licenses">
        <button type="button" className="text-btn" onClick={() => onOpenLegal('privacy')}>
          Privacy
        </button>
        <button type="button" className="text-btn" onClick={() => onOpenLegal('terms')}>
          Terms
        </button>
        <button type="button" className="text-btn" onClick={() => onOpenLegal('licenses')}>
          Licenses
        </button>
      </nav>
    </div>
  </footer>
);
