import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ACCEPT_ATTRIBUTE } from '../../constants';
import type { ColorOptions } from '../../types';
import { ArrowRightIcon, UploadIcon } from '../icons';
import { SilkPlate } from '../ui/SilkPlate';
import { Tick } from '../ui/Tick';
import { loadSpecimen, SPECIMEN_SRC, Sprite, type SpriteSource, useProcessedSprite } from './sprite';

/** Maroon sheen peak for the cover silk; mirrored in scripts/check-contrast.cjs. */
const COVER_SILK = '#b3263a';

interface LandingHeroProps {
  onFileSelect: (file: File) => void;
  onLaunchStudio: () => void;
}

const GRID_OPTIONS = [16, 32, 48, 96] as const;
const COLORS = 16;

/** Booklet cover: the koi printed as a live sprite on the red plate. Drop an image to reprint the cover. */
export const LandingHero: React.FC<LandingHeroProps> = ({ onFileSelect, onLaunchStudio }) => {
  const [source, setSource] = useState<SpriteSource | null>(null);
  const [dropped, setDropped] = useState<{ file: File; url: string } | null>(null);
  const [gridSize, setGridSize] = useState<number>(48);
  const [dither, setDither] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadSpecimen()
      .then((img) => {
        if (!cancelled) setSource((current) => current ?? img);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => {
    if (dropped) URL.revokeObjectURL(dropped.url);
  }, [dropped]);

  const options = useMemo<ColorOptions>(
    () => ({
      mode: 'reduced',
      reducedColors: COLORS,
      customPalette: [],
      quantization: 0,
      dithering: dither,
      transparentBackground: false,
      backgroundColor: '#ffffff',
    }),
    [dither],
  );

  const processed = useProcessedSprite(source, gridSize, options);
  const palette = processed?.palette ?? [];

  const takeFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const bitmap = await createImageBitmap(file);
      setSource(bitmap);
      setDropped({ file, url: URL.createObjectURL(file) });
      setShowPhoto(false);
    } catch {
      // Undecodable here: hand it to the Studio, which reports the error where the fix lives.
      onFileSelect(file);
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    void takeFile(event.dataTransfer.files?.[0]);
  };

  const photoSrc = dropped ? dropped.url : SPECIMEN_SRC;
  const subject = dropped ? dropped.file.name : 'koi sample';

  return (
    <section className="cover" id="top" aria-labelledby="cover-title">
      <div
        className={`cover-plate${dragOver ? ' is-drag-over' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <SilkPlate color={COVER_SILK} />
        <div className="cover-art">
          <Sprite
            processed={processed}
            photo={showPhoto ? { src: photoSrc, alt: `Original photo: ${subject}` } : null}
            label={`${subject} converted live to ${gridSize} by ${gridSize} pixels with ${palette.length} colors`}
            className="cover-sprite"
          />

          <div className="callout callout-grid" role="group" aria-label="Grid size">
            <span className="callout-num pixel" aria-hidden="true">
              A
            </span>
            {GRID_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                className="callout-chip pixel"
                aria-pressed={gridSize === size}
                onClick={() => setGridSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="callout callout-view" role="group" aria-label="Cover controls">
            <span className="callout-num pixel" aria-hidden="true">
              B
            </span>
            <button type="button" className="callout-chip" aria-pressed={dither} onClick={() => setDither((on) => !on)}>
              Dither
            </button>
            <button type="button" className="callout-chip" aria-pressed={showPhoto} onClick={() => setShowPhoto((on) => !on)}>
              Photo
            </button>
          </div>
        </div>

        <div className="cover-legend">
          <p className="cover-legend-line">
            <span className="pixel tnum">
              <Tick value={gridSize} /> x <Tick value={gridSize} />
            </span>
            <span>{palette.length} colors from the image</span>
          </p>
          <ul className="cover-swatches" aria-label={`${palette.length} extracted colors`}>
            {palette.map((hex, index) => (
              <li key={`${hex}-${index}`} style={{ background: hex, '--i': index } as React.CSSProperties} title={hex.toUpperCase()} aria-label={hex.toUpperCase()} />
            ))}
          </ul>
        </div>
      </div>

      <div className="cover-copy">
        <h1 className="cover-title" id="cover-title">
          Real pixel art from any picture.
        </h1>
        <p className="cover-pitch">
          Pick a true grid from 8 to 256 cells, cut the colors down, dither, and export a crisp PNG, JPG, or WEBP. It all happens on
          this page; your image never leaves it.
        </p>

        <div className="cover-actions">
          {dropped ? (
            <button type="button" className="cover-cta" onClick={() => onFileSelect(dropped.file)}>
              Open {dropped.file.name} in Studio
              <ArrowRightIcon size={18} />
            </button>
          ) : (
            <button type="button" className="cover-cta" onClick={onLaunchStudio}>
              Open Studio
              <ArrowRightIcon size={18} />
            </button>
          )}

          <button type="button" className="cover-drop" onClick={() => fileInputRef.current?.click()}>
            <UploadIcon size={16} />
            {dropped ? 'Try another image' : 'Drop an image on the cover, or browse'}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="visually-hidden"
          aria-label="Choose an image to print on the cover"
          onChange={(event) => {
            void takeFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>
    </section>
  );
};
