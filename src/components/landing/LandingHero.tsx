import React, { useEffect, useRef, useState } from 'react';
import { processColors } from '../../lib/colors';
import { rasterizeToGrid, renderProcessedPreview } from '../../lib/pixelate';
import type { PreviewMode, ProcessedImage } from '../../types';
import { ArrowRightIcon, SpinnerIcon, UploadIcon } from '../icons';

interface LandingHeroProps {
  onFileSelect: (file: File) => void;
  onLaunchStudio: () => void;
}

const SPECIMEN_SRC = '/specimen.jpg';
const GRID_OPTIONS = [16, 32, 48, 96] as const;
const COLORS = 16;

const FALLBACK_PALETTE = [
  '#0c1a2e', '#113054', '#165180', '#1c78a6',
  '#2aa3c7', '#63c6d8', '#254a36', '#457842',
  '#82ad5a', '#c45238', '#e86f34', '#f29e38',
  '#df649c', '#f5a8cb', '#dcd7cc', '#f8f5ee',
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onFileSelect,
  onLaunchStudio,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [specimenReady, setSpecimenReady] = useState(false);
  const [mode, setMode] = useState<PreviewMode>('compare');
  const [splitPos, setSplitPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const [gridSize, setGridSize] = useState<number>(48);
  const [ditherOn, setDitherOn] = useState<boolean>(true);
  const [gridOverlay, setGridOverlay] = useState<boolean>(false);
  const [palette, setPalette] = useState<string[]>(FALLBACK_PALETTE);
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const decodedImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const computeProcessed = (img: HTMLImageElement) => {
      const grid = rasterizeToGrid(img, img.naturalWidth, img.naturalHeight, gridSize, gridSize, null);
      const next = processColors(grid, {
        mode: 'reduced',
        reducedColors: COLORS,
        customPalette: [],
        quantization: 0,
        dithering: ditherOn,
        transparentBackground: false,
        backgroundColor: '#f8f6f1',
      });
      if (cancelled) return;
      setProcessed(next);
      if (next.palette.length > 0) {
        setPalette(next.palette);
      }
      setSpecimenReady(true);
    };

    if (decodedImgRef.current) {
      computeProcessed(decodedImgRef.current);
      return;
    }

    const img = new Image();
    img.src = SPECIMEN_SRC;
    img
      .decode()
      .then(() => {
        if (cancelled) return;
        decodedImgRef.current = img;
        computeProcessed(img);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [gridSize, ditherOn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processed) return;
    renderProcessedPreview(canvas, processed, 720, 540, gridOverlay);
  }, [processed, gridOverlay]);

  const stopSweep = () => setTouched(true);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const exportSize = gridSize * 8;

  return (
    <section
      className="landing-hero"
      id="top"
      aria-label="Hero and live pixel studio preview"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="hero-split-layout">
        <div className="hero-copy-col">
          <h1 className="hero-title">
            Turn photos into{' '}
            <span className="hero-title-accent">exact pixel art</span>, locally.
          </h1>

          <p className="hero-subtext">
            Area-averaged <strong className="text-em">8 to 256 px</strong> integer grids,{' '}
            <strong className="text-em">Median-Cut</strong> palettes, and crisp nearest-neighbor{' '}
            <strong className="text-em">PNG, JPG, or WEBP</strong> exports right in your browser.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              onClick={onLaunchStudio}
              className="btn-hero-primary"
            >
              <span>Open Pixel Studio</span>
              <ArrowRightIcon size={17} />
            </button>

            <button
              type="button"
              data-spotlight="dashed"
              onClick={() => fileInputRef.current?.click()}
              className={`hero-drop-tray${isDragOver ? ' is-drag-over' : ''}`}
            >
              <UploadIcon size={16} />
              <span>{isDragOver ? 'Release to open in Studio' : 'Drop or choose an image (PNG, JPG, WEBP)'}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="visually-hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Enlarged Live Interactive Product Proof */}
        <div className="hero-proof-sheet" id="demo" data-spotlight="" aria-busy={!specimenReady}>
          <div className="hero-workbench-top">
            <div className="segmented hero-mode-seg" role="group" aria-label="Preview view mode">
              {(['compare', 'pixel', 'original'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className="segmented-option"
                  aria-pressed={mode === item}
                  onClick={() => setMode(item)}
                >
                  {item === 'compare' ? 'Compare' : item === 'pixel' ? 'Pixel art' : 'Original'}
                </button>
              ))}
            </div>

            <div className="hero-workbench-meta">
              <button
                type="button"
                className={`hero-grid-toggle${gridOverlay ? ' is-active' : ''}`}
                aria-pressed={gridOverlay}
                onClick={() => setGridOverlay((prev) => !prev)}
              >
                Grid lines
              </button>
              <span key={`${gridSize}-${mode}`} className="hero-readout mono tnum">
                <strong className="hero-readout-strong">
                  {gridSize}&times;{gridSize}
                </strong>{' '}
                &middot; {exportSize}&times;{exportSize} px
              </span>
            </div>
          </div>

          <div
            className={`demo-viewport hero-split-viewport${mode === 'compare' && !touched ? ' is-sweeping' : ''}`}
            style={
              mode === 'compare' && touched
                ? ({ '--split': `${splitPos}%` } as React.CSSProperties)
                : undefined
            }
          >
            {!specimenReady ? (
              <div className="hero-loading-veil" role="status">
                <SpinnerIcon size={18} />
                <span>Decoding specimen...</span>
              </div>
            ) : null}

            {mode !== 'pixel' ? (
              <div
                className="demo-layer original-layer"
                style={mode === 'original' ? { clipPath: 'none' } : undefined}
              >
                <img
                  src={SPECIMEN_SRC}
                  alt="Original koi pond photograph specimen at 1024 by 1024 pixels"
                  className="demo-img"
                  draggable={false}
                />
              </div>
            ) : null}

            {mode !== 'original' ? (
              <div
                className="demo-layer pixel-layer"
                style={mode === 'pixel' ? { clipPath: 'none' } : undefined}
              >
                <canvas
                  ref={canvasRef}
                  className="demo-img pixel-img"
                  role="img"
                  aria-label={`Koi pond converted live to ${gridSize} by ${gridSize} pixel art with ${COLORS} Median-Cut colors`}
                />
              </div>
            ) : null}

            {mode === 'compare' ? (
              <>
                <div className="demo-divider-rule">
                  <div className="divider-line" />
                  <div className="divider-handle" aria-hidden="true">
                    <span>||</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPos}
                  onPointerDown={stopSweep}
                  onFocus={stopSweep}
                  onChange={(e) => {
                    stopSweep();
                    setSplitPos(Number(e.target.value));
                  }}
                  className="demo-range-input"
                  aria-label="Compare original specimen and live pixel art conversion"
                />
              </>
            ) : null}
          </div>

          <div className="hero-proof-controls" role="group" aria-label="Live pixel engine controls">
            <div className="hero-controls-top">
              <div className="hero-grid-pills tnum" role="group" aria-label="Target grid resolution">
                {GRID_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`hero-grid-pill${gridSize === size ? ' is-active' : ''}`}
                    onClick={() => setGridSize(size)}
                    aria-pressed={gridSize === size}
                  >
                    {size}&times;{size}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`hero-dither-switch${ditherOn ? ' is-active' : ''}`}
                onClick={() => setDitherOn((prev) => !prev)}
                aria-pressed={ditherOn}
              >
                <span>Floyd-Steinberg dither</span>
                <span className="switch-track" aria-hidden="true">
                  <span className="switch-thumb" />
                </span>
              </button>
            </div>

            <div className="hero-palette-row">
              <span className="palette-caption">Extracted palette ({palette.slice(0, COLORS).length})</span>
              <div
                className="hero-swatch-grid"
                role="list"
                aria-label={`Extracted ${COLORS}-color Median-Cut palette`}
              >
                {palette.slice(0, COLORS).map((hex, index) => (
                  <span
                    key={`${hex}-${index}`}
                    role="listitem"
                    className="hero-swatch-chip"
                    style={{ backgroundColor: hex }}
                    title={hex.toUpperCase()}
                    aria-label={`Color swatch ${index + 1} ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
