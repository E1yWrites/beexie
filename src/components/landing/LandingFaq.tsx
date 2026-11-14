import React from 'react';

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Is this real pixel art or a blur filter?',
    a: 'Real. The image is area-averaged down to the exact grid you pick, the colors are quantized, and the result is scaled up with nearest neighbor only. The grid you choose is the file you get.',
  },
  {
    q: 'Do my images get uploaded?',
    a: 'No. Decoding, processing, and encoding all happen in this tab. Nothing about your image, not even its name, leaves your device.',
  },
  {
    q: 'Which color options are there?',
    a: 'Original colors, a median-cut palette of 2 to 64 colors, grayscale, 1-bit monochrome, or your own hex palette. Add Floyd-Steinberg or Bayer dithering and posterize levels, or start from a retro preset.',
  },
  {
    q: 'What can I export, and can I use it commercially?',
    a: 'PNG with optional transparency, JPG, or WEBP at 1x, 2x, 4x, or 8x, up to 16,384 px a side. The files are yours with no watermark.',
  },
  {
    q: 'Can I fix a single pixel?',
    a: 'Yes. The Studio has a pencil, eraser, color picker, and undo for touch-ups on the converted grid. Changing a setting reprocesses and clears them.',
  },
  {
    q: 'Can I convert many images at once?',
    a: 'Drop two or more files into the Studio. They are converted with the current settings and downloaded as one zip with a contact sheet.',
  },
];

/** Booklet Q and A page: every answer visible, no accordion to click through. */
export const LandingFaq: React.FC = () => (
  <section className="faq" id="faq" aria-labelledby="faq-title">
    <h2 className="spread-title" id="faq-title">
      Questions and answers
    </h2>
    <dl className="faq-list">
      {FAQ_ITEMS.map((item) => (
        <div key={item.q} className="faq-item">
          <dt>{item.q}</dt>
          <dd>{item.a}</dd>
        </div>
      ))}
    </dl>
  </section>
);
