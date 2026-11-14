import type { EditTool } from '../../lib/edits';
import type { PreviewMode } from '../../types';
import { Segmented } from '../ui/Segmented';

interface StageBarProps {
  mode: PreviewMode;
  disabled: boolean;
  zoomPercent: number;
  autoFit: boolean;
  onMode: (mode: PreviewMode) => void;
  onZoomStep: (delta: number) => void;
  onZoomReset: () => void;
  onFit: () => void;
  tool: EditTool;
  color: string;
  canUndo: boolean;
  onTool: (tool: EditTool) => void;
  onColor: (color: string) => void;
  onUndo: () => void;
}

export function StageBar({
  mode,
  disabled,
  zoomPercent,
  autoFit,
  onMode,
  onZoomStep,
  onZoomReset,
  onFit,
  tool,
  color,
  canUndo,
  onTool,
  onColor,
  onUndo,
}: StageBarProps) {
  return (
    <div className="stagebar">
      <Segmented<PreviewMode>
        label="Preview mode"
        value={mode}
        onChange={onMode}
        options={[
          { value: 'original', label: 'Original', disabled },
          { value: 'pixel', label: 'Pixel art', disabled },
          { value: 'compare', label: 'Compare', disabled },
        ]}
      />

      <div className="zoom" role="group" aria-label="Touch-up tools">
        <Segmented<EditTool>
          label="Touch-up tool"
          value={tool}
          onChange={onTool}
          options={[
            { value: 'off', label: 'View', disabled },
            { value: 'pencil', label: 'Pencil', disabled, title: 'Paint single pixels' },
            { value: 'eraser', label: 'Erase', disabled, title: 'Make pixels transparent' },
            { value: 'picker', label: 'Pick', disabled, title: 'Pick a color from the art' },
          ]}
        />
        <input
          type="color"
          value={color}
          disabled={disabled}
          aria-label="Pencil color"
          onChange={(event) => onColor(event.target.value)}
        />
        <button type="button" className="zoom-btn" onClick={onUndo} disabled={disabled || !canUndo} title="Undo last stroke">
          Undo
        </button>
      </div>

      <div className="zoom" role="group" aria-label="Preview zoom">
        <button
          type="button"
          className={`zoom-btn${autoFit ? ' is-active' : ''}`}
          onClick={onFit}
          aria-pressed={autoFit}
          title="Fit to screen"
          disabled={disabled}
        >
          Fit
        </button>
        <button type="button" className="zoom-btn" onClick={() => onZoomStep(-25)} aria-label="Zoom out" disabled={disabled}>
          −
        </button>
        <button
          type="button"
          className="zoom-pct"
          onClick={onZoomReset}
          title="Set zoom to 100%"
          aria-label={`Zoom ${zoomPercent} percent. Set to 100 percent.`}
          disabled={disabled}
        >
          {zoomPercent}%
        </button>
        <button type="button" className="zoom-btn" onClick={() => onZoomStep(25)} aria-label="Zoom in" disabled={disabled}>
          +
        </button>
      </div>
    </div>
  );
}
