import React from 'react';

const RULES = [
  'Your image is decoded inside this browser tab. No server ever receives it.',
  'Every step, from the grid to the colors to the export, runs on your device.',
  'The image is released from memory when you replace it, start over, or close the tab.',
  'The only thing beexie remembers is your light or dark theme choice.',
];

/** The booklet's safety page: short, numbered, and true. */
export const LandingPrivacy: React.FC = () => (
  <section className="privacy" id="privacy" aria-labelledby="privacy-title">
    <h2 className="privacy-title" id="privacy-title">
      It stays in your browser.
    </h2>
    <ol className="privacy-rules">
      {RULES.map((rule, index) => (
        <li key={rule}>
          <span className="privacy-num pixel" aria-hidden="true">
            {index + 1}
          </span>
          <p>{rule}</p>
        </li>
      ))}
    </ol>
  </section>
);
