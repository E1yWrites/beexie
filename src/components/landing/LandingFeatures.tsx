import React from 'react';
import { GRID_PRESETS } from '../../constants';

interface Callout {
  label: string;
  text: string;
}

interface Panel {
  stage: 'image' | 'grid' | 'color' | 'finish';
  title: string;
  lead: string;
  diagram: React.ReactNode;
  callouts: Callout[];
}

/* Diagrams are drawn replicas of the Studio's real controls, lettered for the legend. */
const PANELS: Panel[] = [
  {
    stage: 'image',
    title: 'Load a picture',
    lead: 'Any photo, render, or sketch works as the source.',
    diagram: (
      <div className="dg dg-drop">
        <span className="dg-mark pixel">a</span>
        <span className="dg-drop-box">Drop an image on the page</span>
        <span className="dg-mark pixel">b</span>
        <span className="dg-chip-row">
          <span className="dg-chip">PNG</span>
          <span className="dg-chip">JPG</span>
          <span className="dg-chip">WEBP</span>
        </span>
      </div>
    ),
    callouts: [
      { label: 'a', text: 'Drop it, browse for it, or paste it. Drop several to get a zip.' },
      { label: 'b', text: 'PNG, JPG, or WEBP up to 30 MB, decoded right here.' },
    ],
  },
  {
    stage: 'grid',
    title: 'Pick the grid',
    lead: 'The grid is the real resolution, not a blur filter.',
    diagram: (
      <div className="dg dg-grid">
        <span className="dg-mark pixel">a</span>
        <span className="dg-presets">
          {GRID_PRESETS.map((size) => (
            <span key={size} className={`dg-preset pixel${size === 32 ? ' is-on' : ''}`}>
              {size}
            </span>
          ))}
        </span>
        <span className="dg-mark pixel">b</span>
        <span className="dg-dims pixel">
          <span>48</span>x<span>27</span>
        </span>
      </div>
    ),
    callouts: [
      { label: 'a', text: 'Presets from 8 to 256 cells across.' },
      { label: 'b', text: 'Or type exact width and height, aspect locked or free.' },
    ],
  },
  {
    stage: 'color',
    title: 'Set the colors',
    lead: 'Fewer colors is where pixel art gets its look.',
    diagram: (
      <div className="dg dg-color">
        <span className="dg-mark pixel">a</span>
        <span className="dg-seg">
          <span>Orig</span>
          <span className="is-on">Palette</span>
          <span>Gray</span>
          <span>Mono</span>
          <span>Custom</span>
        </span>
        <span className="dg-mark pixel">b</span>
        <span className="dg-swatches" aria-hidden="true">
          {['#1d2a1f', '#2b5f8a', '#2f7f8f', '#4a9c3a', '#8a5a33', '#ec6a20', '#ffd23f', '#f8fbf4'].map((hex) => (
            <i key={hex} style={{ background: hex }} />
          ))}
        </span>
        <span className="dg-mark pixel">c</span>
        <span className="dg-switch">
          <i />
          Dither
        </span>
      </div>
    ),
    callouts: [
      { label: 'a', text: 'Keep the originals, extract a palette, go gray, go 1-bit, or bring your own.' },
      { label: 'b', text: 'Median cut picks 2 to 64 colors from the image itself.' },
      { label: 'c', text: 'Floyd-Steinberg or Bayer dithering, plus five retro presets.' },
    ],
  },
  {
    stage: 'finish',
    title: 'Export the file',
    lead: 'What you see in the preview is exactly what you download.',
    diagram: (
      <div className="dg dg-finish">
        <span className="dg-mark pixel">a</span>
        <span className="dg-seg">
          <span className="is-on">PNG</span>
          <span>JPG</span>
          <span>WEBP</span>
        </span>
        <span className="dg-mark pixel">b</span>
        <span className="dg-seg pixel">
          <span>1x</span>
          <span>2x</span>
          <span className="is-on">4x</span>
          <span>8x</span>
        </span>
        <span className="dg-mark pixel">c</span>
        <span className="dg-download">Download PNG</span>
      </div>
    ),
    callouts: [
      { label: 'a', text: 'PNG keeps transparency; JPG and WEBP get a fill color and quality.' },
      { label: 'b', text: 'Scale 1x to 8x with nearest neighbor, up to 16,384 px a side.' },
      { label: 'c', text: 'A real encoded file. Touch up single pixels first if you like.' },
    ],
  },
];

/** "How to play": one numbered panel per Studio stage. */
export const LandingFeatures: React.FC = () => {
  return (
    <section className="howto" id="how-to-play" aria-labelledby="howto-title">
      <h2 className="spread-title" id="howto-title">
        How to play
      </h2>
      <ol className="howto-panels">
        {PANELS.map((panel, index) => (
          <li key={panel.stage} className={`howto-panel howto-${panel.stage}`}>
            <div className="howto-head">
              <span className="howto-num pixel" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="howto-title">{panel.title}</h3>
            </div>
            <p className="howto-lead">{panel.lead}</p>
            <div className="howto-diagram" aria-hidden="true">
              {panel.diagram}
            </div>
            <ul className="howto-legend">
              {panel.callouts.map((callout) => (
                <li key={callout.label}>
                  <span className="dg-mark pixel" aria-hidden="true">
                    {callout.label}
                  </span>
                  <span>{callout.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};
