import { useState } from 'react';
import { formatBytes } from '../../lib/format';
import type { CropRect } from '../../lib/transform';
import type { SourceImage, SourceTransform } from '../../types';
import { CropEditor } from './CropEditor';
import { CloseIcon, ImageIcon, SpinnerIcon, UploadIcon } from '../icons';

interface ImagePanelProps {
  source: SourceImage | null;
  error: string | null;
  busy: boolean;
  onPick: () => void;
  onRemove: () => void;
  onDismissError: () => void;
  original: SourceImage | null;
  transform: SourceTransform;
  gridRatio: number | null;
  onRotate: (direction: 1 | -1) => void;
  onCrop: (crop: CropRect | null) => void;
  onResetTransform: () => void;
}

export function ImagePanel({
  source,
  error,
  busy,
  onPick,
  onRemove,
  onDismissError,
  original,
  transform,
  gridRatio,
  onRotate,
  onCrop,
  onResetTransform,
}: ImagePanelProps) {
  const [cropping, setCropping] = useState(false);
  const turned = transform.rotation !== 0 || transform.crop !== null;

  return (
    <div className="panel-body">
      {source ? (
        <>
          <div className="source">
            <img className="source-image" src={source.url} alt={`Original ${source.name}`} draggable={false} />
            <div className="source-meta">
              <strong title={source.name}>{source.name}</strong>
              <span className="tnum">
                {source.width} &times; {source.height} px &middot; {formatBytes(source.size)}
              </span>
            </div>
          </div>
          <div className="source-actions">
            <button type="button" className="btn-secondary" onClick={onPick} disabled={busy}>
              <UploadIcon size={14} />
              Replace
            </button>
            <button type="button" className="btn-quiet" onClick={onRemove} disabled={busy}>
              Remove
            </button>
          </div>

          <div className="panel-group">
            <div className="field-head">
              <span className="field-label">Turn and crop</span>
              {turned && !cropping ? (
                <button
                  type="button"
                  className="text-btn"
                  onClick={onResetTransform}
                >
                  Undo turn and crop
                </button>
              ) : null}
            </div>
            {cropping && original ? (
              <CropEditor
                original={original}
                transform={transform}
                gridRatio={gridRatio}
                onApply={(crop) => {
                  onCrop(crop);
                  setCropping(false);
                }}
                onCancel={() => setCropping(false)}
              />
            ) : (
              <div className="crop-actions">
                <button type="button" className="btn-secondary" onClick={() => onRotate(-1)} disabled={busy}>
                  Rotate left
                </button>
                <button type="button" className="btn-secondary" onClick={() => onRotate(1)} disabled={busy}>
                  Rotate right
                </button>
                <button type="button" className="btn-secondary" onClick={() => setCropping(true)} disabled={busy}>
                  {transform.crop ? 'Edit crop' : 'Crop'}
                </button>
              </div>
            )}
            <p className="panel-note">Turning and cropping pick which part of the photo becomes pixel art. They never paint pixels.</p>
          </div>
        </>
      ) : (
        <button type="button" className="dropzone" onClick={onPick} disabled={busy} aria-busy={busy}>
          <span className="dropzone-icon">
            {busy ? <SpinnerIcon size={22} /> : <ImageIcon size={24} />}
          </span>
          <span className="dropzone-title">{busy ? 'Loading image...' : 'Drop a specimen or browse'}</span>
          <span className="dropzone-sub">PNG, JPG or WEBP, up to 30 MB</span>
          <span className="dropzone-hint">or paste with Ctrl/Cmd + V</span>
        </button>
      )}

      {error ? (
        <div className="alert" role="alert" id="upload-error">
          <span>{error}</span>
          <button type="button" className="alert-close" onClick={onDismissError} aria-label="Dismiss error">
            <CloseIcon size={13} />
          </button>
        </div>
      ) : null}

      <p className="panel-note">
        The original is decoded, capped at 4096 px and downsampled on this device. Nothing is uploaded.
      </p>
    </div>
  );
}
