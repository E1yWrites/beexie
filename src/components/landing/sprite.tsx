import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { processColors } from '../../lib/colors';
import { rasterizeToGrid, renderProcessedPreview } from '../../lib/pixelate';
import type { ColorOptions, ProcessedImage } from '../../types';
import { useElementSize } from '../../hooks/useElementSize';

export const SPECIMEN_SRC = `${import.meta.env.BASE_URL}specimen.jpg`;

let specimenPromise: Promise<HTMLImageElement> | null = null;

/** Decode the koi specimen once and share it across every landing sprite. */
export function loadSpecimen(): Promise<HTMLImageElement> {
  if (!specimenPromise) {
    const img = new Image();
    img.src = SPECIMEN_SRC;
    specimenPromise = img.decode().then(() => img);
  }
  return specimenPromise;
}

export type SpriteSource = HTMLImageElement | ImageBitmap;

/** Run the real pipeline (rasterize, then processColors) on a source at a square grid. */
export function useProcessedSprite(
  source: SpriteSource | null,
  grid: number,
  options: ColorOptions,
): ProcessedImage | null {
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const key = JSON.stringify(options);

  useEffect(() => {
    if (!source) return;
    const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
    const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
    // Center-crop to a square so the sprite keeps its aspect on the plate.
    const side = Math.min(width, height);
    const crop = document.createElement('canvas');
    crop.width = side;
    crop.height = side;
    crop.getContext('2d')?.drawImage(source, (width - side) / 2, (height - side) / 2, side, side, 0, 0, side, side);
    setProcessed(processColors(rasterizeToGrid(crop, side, side, grid, grid, null), options));
  }, [source, grid, key]);

  return processed;
}

interface SpriteProps {
  processed: ProcessedImage | null;
  label: string;
  className?: string;
  /** Show this photo in the same box instead of the sprite. */
  photo?: { src: string; alt: string } | null;
  /** Rotate palette colors while hovered (the sixteen-color screen trick). */
  cycleOnHover?: boolean;
}

const KEYLINE = 6; // 3px key line on both sides

/** Map every pixel to its palette index so colors can rotate without reprocessing. */
function paletteIndexes(processed: ProcessedImage): Int16Array | null {
  if (processed.palette.length < 2) return null;
  const lookup = new Map(processed.palette.map((hex, index) => [hex.toLowerCase(), index]));
  const out = new Int16Array(processed.width * processed.height);
  const d = processed.data;
  for (let p = 0; p < out.length; p += 1) {
    const hex = '#' + [d[p * 4], d[p * 4 + 1], d[p * 4 + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
    out[p] = lookup.get(hex) ?? -1;
  }
  return out;
}

/**
 * Sprite at a true integer scale: the box is floor(available / cells) * cells,
 * so every art pixel is the same size. New results reveal with the ghost grid fill.
 */
export function Sprite({ processed, label, className, photo, cycleOnHover }: SpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, size } = useElementSize<HTMLDivElement>();
  const [fillKey, setFillKey] = useState(0);
  const [hovered, setHovered] = useState(false);

  const cells = processed?.width ?? 48;
  const scale = Math.max(1, Math.floor((size.width - KEYLINE) / cells));
  const box = cells * scale;
  const ready = size.width > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processed || !ready) return;
    renderProcessedPreview(canvas, processed, processed.width * scale, processed.height * scale, false);
    setFillKey((key) => key + 1);
  }, [processed, scale, ready]);

  // C12: palette rotation while hovered. Stepped, ~8 frames a second, never under reduced motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!cycleOnHover || !hovered || !processed || !canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const indexes = paletteIndexes(processed);
    if (!indexes) return;
    const colors = processed.palette.map((hex) => [1, 3, 5].map((o) => parseInt(hex.slice(o, o + 2), 16)));
    const grid = document.createElement('canvas');
    grid.width = processed.width;
    grid.height = processed.height;
    const gctx = grid.getContext('2d');
    const ctx = canvas.getContext('2d');
    if (!gctx || !ctx) return;
    const image = gctx.createImageData(processed.width, processed.height);
    let shift = 0;
    const timer = window.setInterval(() => {
      shift = (shift + 1) % colors.length;
      for (let p = 0; p < indexes.length; p += 1) {
        const source = indexes[p];
        const c = source < 0 ? null : colors[(source + shift) % colors.length];
        image.data[p * 4] = c ? c[0] : processed.data[p * 4];
        image.data[p * 4 + 1] = c ? c[1] : processed.data[p * 4 + 1];
        image.data[p * 4 + 2] = c ? c[2] : processed.data[p * 4 + 2];
        image.data[p * 4 + 3] = processed.data[p * 4 + 3];
      }
      gctx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(grid, 0, 0, canvas.width, canvas.height);
    }, 125);
    return () => {
      window.clearInterval(timer);
      renderProcessedPreview(canvas, processed, canvas.width, canvas.height, false);
    };
  }, [cycleOnHover, hovered, processed]);

  const rows = processed ? Math.max(4, Math.min(processed.height, 32)) : 16;
  const boxStyle = ready ? { width: box + KEYLINE, height: box + KEYLINE } : undefined;

  return (
    <div
      ref={ref}
      className={`sprite-slot${className ? ` ${className}` : ''}`}
      onPointerEnter={cycleOnHover ? () => setHovered(true) : undefined}
      onPointerLeave={cycleOnHover ? () => setHovered(false) : undefined}
    >
      {photo ? (
        <img className="sprite sprite-photo" src={photo.src} alt={photo.alt} draggable={false} style={boxStyle} />
      ) : (
        <div className="sprite ghost-grid" style={{ ...boxStyle, '--cell': `${scale}px` } as CSSProperties}>
          <canvas ref={canvasRef} className="sprite-canvas" role="img" aria-label={label} style={ready ? { width: box, height: box } : undefined} />
          {fillKey > 0 ? (
            <span
              key={fillKey}
              className="scanfill ghost-grid"
              aria-hidden="true"
              style={{ '--rows': rows, '--cell': `${scale}px` } as CSSProperties}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
