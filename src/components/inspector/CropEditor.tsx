import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { clampCrop, cropPixels, lockCrop, MIN_CROP, rotatedSize, type CropRect } from '../../lib/transform';
import type { SourceImage, SourceTransform } from '../../types';
import { Segmented } from '../ui/Segmented';

type Aspect = 'free' | 'square' | 'grid';
type Drag = { kind: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'new'; startX: number; startY: number; from: CropRect };

interface CropEditorProps {
  original: SourceImage;
  transform: SourceTransform;
  /** Width / height of a custom grid, offered as a lock when the grid is custom. */
  gridRatio: number | null;
  onApply: (crop: CropRect | null) => void;
  onCancel: () => void;
}

const FULL: CropRect = { x: 0, y: 0, width: 1, height: 1 };
const CORNERS = ['nw', 'ne', 'sw', 'se'] as const;

export function CropEditor({ original, transform, gridRatio, onApply, onCancel }: CropEditorProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<CropRect>(transform.crop ?? FULL);
  const [aspect, setAspect] = useState<Aspect>('free');
  const drag = useRef<Drag | null>(null);
  const turned = rotatedSize(original.width, original.height, transform.rotation);
  const ratio = aspect === 'square' ? 1 : aspect === 'grid' ? gridRatio : null;
  const fit = (next: CropRect) => (ratio ? lockCrop(clampCrop(next), ratio, turned.width, turned.height) : clampCrop(next));
  const px = cropPixels(original.width, original.height, { rotation: transform.rotation, crop });

  const point = (event: { clientX: number; clientY: number }) => {
    const rect = boxRef.current!.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
  };

  const start = (kind: Drag['kind']) => (event: ReactPointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const p = point(event);
    drag.current = { kind, startX: p.x, startY: p.y, from: crop };
    boxRef.current!.setPointerCapture(event.pointerId);
  };

  const onMove = (event: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = point(event);
    const dx = p.x - d.startX;
    const dy = p.y - d.startY;
    const f = d.from;
    if (d.kind === 'move') {
      setCrop(clampCrop({ ...f, x: f.x + dx, y: f.y + dy }));
      return;
    }
    if (d.kind === 'new') {
      const x0 = Math.max(0, Math.min(1, d.startX));
      const y0 = Math.max(0, Math.min(1, d.startY));
      const x1 = Math.max(0, Math.min(1, p.x));
      const y1 = Math.max(0, Math.min(1, p.y));
      setCrop(fit({ x: Math.min(x0, x1), y: Math.min(y0, y1), width: Math.abs(x1 - x0), height: Math.abs(y1 - y0) }));
      return;
    }
    const left = d.kind.endsWith('w') ? Math.min(f.x + f.width - MIN_CROP, Math.max(0, f.x + dx)) : f.x;
    const top = d.kind.startsWith('n') ? Math.min(f.y + f.height - MIN_CROP, Math.max(0, f.y + dy)) : f.y;
    const right = d.kind.endsWith('e') ? Math.min(1, f.x + f.width + dx) : f.x + f.width;
    const bottom = d.kind.startsWith('s') ? Math.min(1, f.y + f.height + dy) : f.y + f.height;
    setCrop(fit({ x: left, y: top, width: right - left, height: bottom - top }));
  };

  const imageStyle: CSSProperties =
    transform.rotation % 180 === 0
      ? { width: '100%', transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)` }
      : {
          width: `${(original.width / original.height) * 100}%`,
          transform: `translate(-50%, -50%) rotate(${transform.rotation}deg)`,
        };

  return (
    <div className="crop">
      <div
        ref={boxRef}
        className="crop-box"
        // Tall images are capped at 360 px high by narrowing the box, which keeps its aspect exact.
        style={{ aspectRatio: `${turned.width} / ${turned.height}`, width: `min(100%, ${Math.round((360 * turned.width) / turned.height)}px)` }}
        onPointerDown={start('new')}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <img className="crop-image" src={original.url} alt="" draggable={false} style={imageStyle} />
        <div
          className="crop-rect"
          role="group"
          tabIndex={0}
          aria-label={`Crop area ${px.width} by ${px.height} pixels. Arrow keys move it, Shift with arrow keys resizes it.`}
          style={{
            left: `${crop.x * 100}%`,
            top: `${crop.y * 100}%`,
            width: `${crop.width * 100}%`,
            height: `${crop.height * 100}%`,
          }}
          // A full-frame rect covers the whole box, so dragging on it draws a new crop instead of moving nothing.
          onPointerDown={start(crop.width >= 0.999 && crop.height >= 0.999 ? 'new' : 'move')}
          onKeyDown={(event) => {
            const step = 0.01;
            const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
            const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
            if (!dx && !dy) return;
            event.preventDefault();
            setCrop((c) =>
              event.shiftKey
                ? fit({ ...c, width: c.width + dx, height: c.height + dy })
                : clampCrop({ ...c, x: c.x + dx, y: c.y + dy }),
            );
          }}
        >
          {CORNERS.map((corner) => (
            <span key={corner} className={`crop-handle is-${corner}`} aria-hidden="true" onPointerDown={start(corner)} />
          ))}
        </div>
      </div>

      <div className="crop-bar">
        <Segmented<Aspect>
          label="Crop aspect"
          value={aspect}
          onChange={(value) => {
            setAspect(value);
            const r = value === 'square' ? 1 : value === 'grid' ? gridRatio : null;
            if (r) setCrop((c) => lockCrop(c, r, turned.width, turned.height));
          }}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'square', label: '1:1' },
            ...(gridRatio ? [{ value: 'grid' as const, label: 'Grid' }] : []),
          ]}
        />
        <span className="mono tnum crop-size" aria-live="polite">
          {px.width} &times; {px.height}
        </span>
      </div>

      <div className="crop-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onApply(crop.width >= 0.999 && crop.height >= 0.999 ? null : crop)}
        >
          Apply crop
        </button>
        <button type="button" className="text-btn" onClick={() => setCrop(FULL)}>
          Full frame
        </button>
        <button type="button" className="text-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
