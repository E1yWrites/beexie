import React, { useEffect, useRef } from 'react';
import { CloseIcon } from '../icons';

export type LegalTab = 'privacy' | 'terms' | 'licenses';

interface LegalModalProps {
  activeTab: LegalTab | null;
  onSelectTab: (tab: LegalTab) => void;
  onClose: () => void;
}

const TABS: { id: LegalTab; label: string }[] = [
  { id: 'privacy', label: 'Privacy & Data Retention' },
  { id: 'terms', label: 'Terms of Service' },
  { id: 'licenses', label: 'Font, Image & Code Licenses' },
];

export const LegalModal: React.FC<LegalModalProps> = ({
  activeTab,
  onSelectTab,
  onClose,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeTab) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [activeTab, onClose]);

  if (!activeTab) return null;

  const handleClearStorage = () => {
    try {
      window.localStorage.removeItem('beexie-theme');
      window.localStorage.removeItem('lanzos-pixel-theme');
      window.localStorage.removeItem('beexie-shortcuts');
    } catch {
      // Ignore storage access errors in restricted modes
    }
    onClose();
  };

  return (
    <div
      className="legal-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="legal-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-modal-header">
          <h2 id="legal-modal-title" className="legal-modal-title">
            beexie Privacy, Terms &amp; Licenses
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="legal-modal-close"
            onClick={onClose}
            aria-label="Close legal and privacy dialog"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div
          className="legal-modal-tabs"
          role="tablist"
          aria-label="Legal document sections"
        >
          {TABS.map((tab, idx) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`legal-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`legal-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                className={`legal-tab-btn${selected ? ' is-active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    onSelectTab(TABS[(idx + 1) % TABS.length].id);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    onSelectTab(TABS[(idx - 1 + TABS.length) % TABS.length].id);
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className="legal-modal-body"
          role="tabpanel"
          id={`legal-panel-${activeTab}`}
          aria-labelledby={`legal-tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTab === 'privacy' && (
            <div className="legal-section-stack">
              <h3>1. Zero Data Collection &amp; Local-Only Processing</h3>
              <p>
                beexie processes all images 100% locally inside your browser using standard HTML5 Canvas 2D APIs.
                We do not collect, transmit, log, or store your photographs, filenames, IP addresses, or usage telemetry on any external server.
              </p>

              <h3>2. Strict Data Retention Limits</h3>
              <ul className="legal-list">
                <li>
                  <strong>Server-Side Retention (0 Seconds):</strong> Zero image bytes are ever uploaded to a remote server.
                </li>
                <li>
                  <strong>In-Memory Image Retention (Session-Only):</strong> Uploaded images and generated bitmaps exist solely in volatile browser memory (<code>ImageBitmap</code> and object URLs). Whenever you replace an image, click Reset, or close the browser tab, object URLs are immediately revoked via <code>URL.revokeObjectURL()</code>.
                </li>
                <li>
                  <strong>Local Storage Retention (User-Controlled):</strong> Only your UI theme preference key (<code>beexie-theme</code>: <code>light</code> or <code>dark</code>) is stored in <code>window.localStorage</code>. No cookies or third-party trackers are ever set.
                </li>
              </ul>

              <div className="legal-action-row">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={handleClearStorage}
                >
                  Clear local storage preferences now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="legal-section-stack">
              <h3>1. Full Intellectual Property Ownership</h3>
              <p>
                You retain 100% copyright and unrestricted commercial rights to every source image you load into beexie and every pixel-art bitmap you export. beexie adds zero watermarks and claims zero license over your creations.
              </p>

              <h3>2. Honest Interface Guarantee (Zero Dark Patterns)</h3>
              <p>
                beexie contains no account walls, no hidden paywalls, no artificial countdown timers, no manipulative opt-out flows, and no synthetic social-proof notifications. Every preview shown on screen is produced by the actual client-side conversion engine.
              </p>

              <h3>3. Warranty Disclaimer</h3>
              <p>
                The software is provided &ldquo;as is&rdquo; without warranty of any kind. Because all processing occurs on your local device, you are responsible for saving your exported PNG, JPEG, or WEBP files to your local disk before closing your browser tab.
              </p>
            </div>
          )}

          {activeTab === 'licenses' && (
            <div className="legal-section-stack">
              <h3>1. Typography Licenses (Self-Hosted, Zero Tracking)</h3>
              <ul className="legal-list">
                <li>
                  <strong>Dela Gothic One:</strong> Copyright The Dela Gothic Project Authors, licensed under the <strong>SIL Open Font License 1.1 (OFL-1.1)</strong>. Bundled locally as <code>.woff2</code>.
                </li>
                <li>
                  <strong>Zen Kaku Gothic New:</strong> Copyright The Zen Project Authors, licensed under the <strong>SIL Open Font License 1.1 (OFL-1.1)</strong>. Bundled locally as <code>.woff2</code>.
                </li>
                <li>
                  <strong>DotGothic16:</strong> Copyright The DotGothic16 Project Authors, licensed under the <strong>SIL Open Font License 1.1 (OFL-1.1)</strong>. Bundled locally as <code>.woff2</code>.
                </li>
              </ul>

              <h3>2. Specimen Images &amp; Artwork</h3>
              <ul className="legal-list">
                <li>
                  <strong>Brand Mark (<code>BeeMark</code> SVG):</strong> Geometric ink-stamp bee emblem authored for beexie in crisp SVG vectors.
                </li>
                <li>
                  <strong>Demo Specimen (<code>public/specimen.jpg</code>):</strong> First-party koi pond photographic specimen created for demonstrating Median-Cut quantization and Floyd-Steinberg dithering, released under <strong>CC0 1.0 Public Domain Dedication</strong>.
                </li>
              </ul>

              <h3>3. Source Code, Shaders &amp; Open-Source Dependencies</h3>
              <p>
                The beexie application source code and pixelation engine (<code>src/lib/*</code>) are licensed under the <strong>MIT License</strong>. Runtime dependencies (<code>react</code>, <code>react-dom</code>) are distributed under the <strong>MIT License</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
