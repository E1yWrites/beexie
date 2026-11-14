import { useEffect, useRef, useState } from 'react';
import { compareFromPointer, compareStep, compareValueText, type CompareKey } from '../../lib/compare';
import { renderProcessedPreview } from '../../lib/pixelate';
import type { ConverterSettings, GridSize, PreviewMode, ProcessedImage, SourceImage } from '../../types';
import { SpinnerIcon } from '../icons';

interface ProofFrameProps {
  source: SourceImage;
  processed: ProcessedImage | null;
  grid: GridSize;
  settings: ConverterSettings;
  mode: PreviewMode;
  compare: number;
  displayWidth: number;
  displayHeight: number;
  busy: boolean;
  editing: boolean;
  onCompare: (value: number) => void;
  /** Fractions 0..1 across the frame; `start` is true on pointer down. */
  onEdit: (fx: number, fy: number, start: boolean) => void;
}

function PixelLayer({
  processed,
  displayWidth,
  displayHeight,
  overlay,
  clip,
}: {
  processed: ProcessedImage | null;
  displayWidth: number;
  displayHeight: number;
  overlay: boolean;
  clip: number | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processed) return;
    const maxSide = 2048;
    const factor = Math.min(1, maxSide / Math.max(displayWidth, displayHeight));
    renderProcessedPreview(
      canvas,
      processed,
      Math.max(1, Math.round(displayWidth * factor)),
      Math.max(1, Math.round(displayHeight * factor)),
      overlay,
    );
  }, [processed, displayWidth, displayHeight, overlay]);

  return (
    <canvas
      ref={canvasRef}
      className="proof-pixel"
      role="img"
      aria-label={
        processed
          ? `Pixel art preview at ${processed.width} by ${processed.height} pixels`
          : 'Pixel art preview, processing'
      }
      style={clip === null ? undefined : { clipPath: `inset(0 0 0 ${clip}%)` }}
    />
  );
}

export function ProofFrame({
  source,
  processed,
  grid,
  settings,
  mode,
  compare,
  displayWidth,
  displayHeight,
  busy,
  editing,
  onCompare,
  onEdit,
}: ProofFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    onCompare(compareFromPointer(clientX, frame.getBoundingClientRect()));
  };

  const editFromPointer = (event: { clientX: number; clientY: number }, start: boolean) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    onEdit((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height, start);
  };

  const release = (pointerId?: number) => {
    if (pointerId !== undefined && activePointerIdRef.current !== null && activePointerIdRef.current !== pointerId) {
      return;
    }
    const idToRelease = pointerId ?? activePointerIdRef.current;
    activePointerIdRef.current = null;
    setDragging(false);
    if (idToRelease !== null && frameRef.current?.hasPointerCapture(idToRelease)) {
      frameRef.current.releasePointerCapture(idToRelease);
    }
  };

  useEffect(() => {
    if (!dragging) return;
    const onBlur = () => release();
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [dragging]);

  const comparing = mode === 'compare';

  return (
    <div
      ref={frameRef}
      className={`proof${comparing ? ' is-comparing' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{ width: displayWidth, height: displayHeight, cursor: editing ? 'crosshair' : undefined, touchAction: editing ? 'none' : undefined }}
      aria-busy={busy}
      onPointerDown={(event) => {
        if ((!comparing && !editing) || activePointerIdRef.current !== null) return;
        activePointerIdRef.current = event.pointerId;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        if (editing) editFromPointer(event, true);
        else updateFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging && activePointerIdRef.current === event.pointerId) {
          if (editing) editFromPointer(event, false);
          else if (comparing) updateFromPointer(event.clientX);
        }
      }}
      onPointerUp={(event) => release(event.pointerId)}
      onPointerCancel={(event) => release(event.pointerId)}
      onLostPointerCapture={(event) => release(event.pointerId)}
    >
      {mode !== 'pixel' ? (
        <img
          className="proof-original"
          src={source.url}
          alt={`Original ${source.name}`}
          draggable={false}
          style={comparing ? { clipPath: `inset(0 ${100 - compare}% 0 0)` } : undefined}
        />
      ) : null}

      {mode !== 'original' ? (
        <PixelLayer
          processed={processed}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
          overlay={settings.gridOverlay}
          clip={comparing ? compare : null}
        />
      ) : null}

      {mode !== 'pixel' ? (
        <span className="proof-tag left">
          Original <span className="mono tnum proof-tag-extra">{source.width}&times;{source.height}</span>
        </span>
      ) : null}
      {mode !== 'original' ? (
        <span className="proof-tag right">
          <span className="mono tnum">
            {grid.width}&times;{grid.height}
          </span>
          {processed && processed.palette.length > 0 ? (
            <span className="proof-tag-extra">
              {' '}
              &middot; <span className="mono tnum">{processed.palette.length}</span> colors
            </span>
          ) : null}
        </span>
      ) : null}

      {comparing ? (
        <div
          className="rule"
          style={{ left: `${compare}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Compare original and pixel art"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(compare)}
          aria-valuetext={compareValueText(compare)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') {
              return;
            }
            event.preventDefault();
            onCompare(compareStep(compare, event.key as CompareKey, event.shiftKey));
          }}
        >
          <span className="rule-handle" aria-hidden="true">
            <span>||</span>
          </span>
        </div>
      ) : null}

      {busy && mode !== 'original' ? (
        <span className="processing" role="status" aria-live="polite">
          <SpinnerIcon size={13} />
          <span>Processing...</span>
        </span>
      ) : null}
    </div>
  );
}
