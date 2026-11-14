import { formatBytes } from '../../lib/format';
import type { SourceImage } from '../../types';
import { CloseIcon, ImageIcon, SpinnerIcon, UploadIcon } from '../icons';

interface ImagePanelProps {
  source: SourceImage | null;
  error: string | null;
  busy: boolean;
  onPick: () => void;
  onRemove: () => void;
  onDismissError: () => void;
}

export function ImagePanel({ source, error, busy, onPick, onRemove, onDismissError }: ImagePanelProps) {
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
