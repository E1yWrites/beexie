import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RETRO_PRESETS, type RetroPresetMeta } from '../../constants';
import type { ColorOptions } from '../../types';
import { loadSpecimen, Sprite, useProcessedSprite } from './sprite';

const PRESET_GRID = 64;

const PLATES = ['red', 'yellow', 'blue', 'ink', 'red'] as const;

function PresetCard({ preset, source, index }: { preset: RetroPresetMeta; source: HTMLImageElement | null; index: number }) {
  const options = useMemo<ColorOptions>(
    () => ({
      mode: preset.settings.colorMode,
      reducedColors: preset.settings.reducedColors,
      customPalette: preset.settings.customPalette ? [...preset.settings.customPalette] : [],
      quantization: preset.settings.quantization,
      dithering: preset.settings.dithering,
      ditherMode: preset.settings.ditherMode,
      transparentBackground: false,
      backgroundColor: '#ffffff',
      retroPreset: preset.id,
    }),
    [preset],
  );
  const processed = useProcessedSprite(source, PRESET_GRID, options);

  return (
    <li className={`cart cart-${PLATES[index % PLATES.length]}`}>
      <div className="cart-label">
        <h3 className="cart-name">{preset.name}</h3>
        <span className="cart-meta pixel tnum">
          {processed ? `${processed.palette.length || preset.settings.reducedColors} colors` : ''}
        </span>
      </div>
      <Sprite
        processed={processed}
        label={`Koi sample processed live with the ${preset.name} preset`}
        className="cart-sprite"
        cycleOnHover
      />
    </li>
  );
}

/** Presets spread: every card is the koi run through the real preset pipeline, in view. */
export const LandingPresets: React.FC = () => {
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Process only when the spread scrolls near the viewport, so the fill plays where it is seen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadSpecimen()
            .then(setSource)
            .catch(() => undefined);
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="presets-spread" id="presets" ref={sectionRef} aria-labelledby="presets-title">
      <div className="spread-head">
        <h2 className="spread-title" id="presets-title">
          Five retro presets
        </h2>
        <p className="spread-lead">
          One click sets palette, dithering, contrast, and outlines for a hardware-era look. Each card below is the koi run through
          that preset, live.
        </p>
      </div>
      <ul className="carts">
        {RETRO_PRESETS.map((preset, index) => (
          <PresetCard key={preset.id} preset={preset} source={source} index={index} />
        ))}
      </ul>
    </section>
  );
};
