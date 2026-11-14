import type { ExportSize, GridSize } from '../../types';
import { SpinnerIcon } from '../icons';

interface StatusBoardProps {
  busy: boolean;
  hasImage: boolean;
  grid: GridSize;
  finalSize: ExportSize;
  paletteSize?: number;
}

export function StatusBoard({ busy, hasImage, grid, finalSize, paletteSize = 0 }: StatusBoardProps) {
  return (
    <div className="status">
      <span className="status-left">
        {busy ? <SpinnerIcon size={13} /> : <i className={`ready-dot${hasImage ? ' is-ready' : ''}`} aria-hidden="true" />}
        <b>{busy ? 'Processing...' : hasImage ? 'Ready' : 'No image'}</b>
      </span>
      <span className="status-facts">
        <span>
          Grid{' '}
          <span className="mono tnum status-fact-val">
            {grid.width} &times; {grid.height}
          </span>
        </span>
        <span>
          Output{' '}
          <span className="mono tnum status-fact-val">
            {finalSize.width} &times; {finalSize.height}
          </span>
        </span>
        {paletteSize > 0 ? (
          <span>
            <span className="mono tnum status-fact-val">{paletteSize}</span> {paletteSize === 1 ? 'color' : 'colors'}
          </span>
        ) : null}
      </span>
    </div>
  );
}
