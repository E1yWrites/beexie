import React from 'react';
import { ArrowRightIcon, BeeMark } from '../icons';
import type { LegalTab } from './LegalModal';

interface LandingFooterProps {
  onLaunchStudio: () => void;
  onOpenLegal: (tab: LegalTab) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onLaunchStudio,
  onOpenLegal,
}) => {
  return (
    <footer className="landing-footer" role="contentinfo">
      <div className="footer-cta-card" data-spotlight="">
        <div className="footer-cta-copy">
          <h2 className="footer-cta-title">
            Ready to draft <span className="hero-title-accent">exact pixel grids?</span>
          </h2>
          <p className="footer-cta-desc">
            Open the Studio workbench to adjust custom dimensions, edit palettes swatch by swatch, and export{' '}
            <strong className="text-em">crisp scaled files</strong>.
          </p>
        </div>
        <button
          type="button"
          className="btn-footer-launch"
          onClick={onLaunchStudio}
        >
          <span>Open Pixel Studio</span>
          <ArrowRightIcon size={16} />
        </button>
      </div>

      <div className="footer-colophon">
        <div className="colophon-left">
          <BeeMark size={20} />
          <span className="colophon-brand">beexie</span>
          <span className="colophon-note">Client-side Canvas 2D · Zero server uploads</span>
        </div>

        <nav className="colophon-legal-links" aria-label="Privacy, terms, and license policies">
          <button
            type="button"
            className="colophon-link-btn"
            onClick={() => onOpenLegal('privacy')}
          >
            Privacy &amp; Retention
          </button>
          <button
            type="button"
            className="colophon-link-btn"
            onClick={() => onOpenLegal('terms')}
          >
            Terms of Service
          </button>
          <button
            type="button"
            className="colophon-link-btn"
            onClick={() => onOpenLegal('licenses')}
          >
            Licenses (MIT &amp; OFL-1.1)
          </button>
        </nav>
      </div>
    </footer>
  );
};
