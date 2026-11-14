import React, { useState } from 'react';
import { ChevronDownIcon } from '../icons';

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'pipeline',
    question: 'How does beexie convert images into genuine pixel art instead of a blur filter?',
    answer: (
      <>
        beexie decodes your source image on an HTML5 2D canvas, downsamples to your target integer grid (8 px to 256 px or custom dimensions) with{' '}
        <strong className="text-em">progressive area averaging</strong>, applies palette quantization and optional Floyd-Steinberg error diffusion, and upscales with{' '}
        <strong className="text-em">strict nearest-neighbor</strong> interpolation.
      </>
    ),
  },
  {
    id: 'privacy',
    question: 'Are my photos uploaded to a server or stored after I close the tab?',
    answer: (
      <>
        <strong className="faq-lead-em">Never.</strong> Every stage executes locally inside your browser tab. Zero image bytes, filenames, or analytics leave your device. Uploaded files reside only in{' '}
        <strong className="text-em">volatile browser memory</strong> and are released immediately when replaced or when the session closes.
      </>
    ),
  },
  {
    id: 'palettes',
    question: 'What palette modes and dithering options are supported?',
    answer: (
      <>
        Keep original full-color pixels, extract an adaptive{' '}
        <strong className="text-em">2-to-64-color palette</strong> via Median-Cut quantization, convert to grayscale or 1-bit monochrome, or build a custom hex swatch palette. Any reduced mode pairs with{' '}
        <strong className="text-em">Floyd-Steinberg dithering</strong> and channel posterization.
      </>
    ),
  },
  {
    id: 'export',
    question: 'What export formats, scales, and commercial rights do I get?',
    answer: (
      <>
        Export crisp PNG (with optional alpha transparency), JPEG, or WEBP files at 1x, 2x, 4x, or 8x integer scale up to 16,384 &times; 16,384 px. You retain{' '}
        <strong className="text-em">100% ownership</strong> and unrestricted commercial rights to every exported bitmap with{' '}
        <strong className="text-em">zero watermarks</strong>.
      </>
    ),
  },
];

export const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="landing-faq-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-sheet-frame" data-spotlight="">
        <div className="faq-intro-col">
          <h2 className="section-title" id="faq-heading">
            Frequently asked questions
          </h2>
          <p className="section-desc">
            Details on our local Canvas 2D pixel pipeline, data retention, and export guarantees.
          </p>
        </div>

        <div className="faq-accordion-col" role="region" aria-label="FAQ items">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const triggerId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;
            return (
              <div key={item.id} className={`faq-row${isOpen ? ' is-open' : ''}`}>
                <h3 className="faq-row-heading">
                  <button
                    type="button"
                    id={triggerId}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <ChevronDownIcon size={16} className="faq-chevron" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  className="faq-panel-wrap"
                >
                  <div className="faq-panel-inner">
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
