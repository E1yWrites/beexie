import React from 'react';

export const LandingFeatures: React.FC<{ onLaunchStudio?: () => void }> = () => {
  return (
    <section className="landing-features-section" id="features" aria-labelledby="features-heading">
      <div className="pipeline-sheet-frame" data-spotlight="">
        <div className="sheet-header-band">
          <h2 className="section-title" id="features-heading">
            Four deterministic press stages
          </h2>
          <p className="section-desc">
            Area-averaged downsampling and Median-Cut quantization executed strictly in browser memory.
          </p>
        </div>

        <ol className="pipeline-sheet">
          <li className="pipeline-step">
            <span className="step-num mono tnum">01</span>
            <h3 className="step-title">Private Local Memory</h3>
            <p className="step-desc">
              Decode <strong className="text-em">PNG, JPG, and WEBP</strong> files straight onto an HTML5 Canvas with{' '}
              <strong className="text-em">zero uploads</strong>.
            </p>
            <div className="step-spec-strip" aria-hidden="true">
              <span className="step-spec-key">PNG &middot; JPG &middot; WEBP</span>
              <span className="step-spec-val">
                <span className="mono tnum">30</span> MB max
              </span>
            </div>
          </li>

          <li className="pipeline-step">
            <span className="step-num mono tnum">02</span>
            <h3 className="step-title">Exact Box Averaging</h3>
            <p className="step-desc">
              Mathematical downsampling onto <strong className="text-em">8 to 256 px</strong> integer grids with aspect lock or custom sizing.
            </p>
            <div className="step-scale-bar mono tnum" aria-hidden="true">
              <span>8&times;8</span>
              <span>16&times;16</span>
              <span className="is-hot">48&times;48</span>
              <span>256&times;256</span>
            </div>
          </li>

          <li className="pipeline-step">
            <span className="step-num mono tnum">03</span>
            <h3 className="step-title">Median-Cut &amp; Dither</h3>
            <p className="step-desc">
              Extract <strong className="text-em">2 to 64</strong> adaptive swatches, 1-bit monochrome, or custom palettes with serpentine diffusion.
            </p>
            <div className="step-ink-ribbon" aria-hidden="true">
              <span style={{ backgroundColor: '#111317' }} />
              <span style={{ backgroundColor: '#1e46e8' }} />
              <span style={{ backgroundColor: '#2aa3c7' }} />
              <span style={{ backgroundColor: '#457842' }} />
              <span style={{ backgroundColor: '#eb4a2d' }} />
              <span style={{ backgroundColor: '#f29e38' }} />
              <span style={{ backgroundColor: '#df649c' }} />
              <span style={{ backgroundColor: '#f8f5ee' }} />
            </div>
          </li>

          <li className="pipeline-step">
            <span className="step-num mono tnum">04</span>
            <h3 className="step-title">Nearest-Neighbor Export</h3>
            <p className="step-desc">
              Download crisp bitmaps with <strong className="text-em">optional alpha transparency</strong> scaled without smoothing blur.
            </p>
            <div className="step-export-strip" aria-hidden="true">
              <span className="step-scale-bar mono tnum">
                <span>1&times;</span>
                <span className="is-hot">2&times;</span>
                <span>4&times;</span>
                <span>8&times;</span>
              </span>
              <span className="step-spec-val">
                <span className="mono tnum">16,384</span> px
              </span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
};
