import { BeeMark, SpinnerIcon } from '../icons';

interface EmptyBenchProps {
  busy: boolean;
  onPick: () => void;
  onLoadSample?: () => void;
}

export function EmptyBench({ busy, onPick, onLoadSample }: EmptyBenchProps) {
  return (
    <div className="empty-stage">
      <div className="empty-bench-stack">
        <button type="button" className="empty-bench" data-spotlight="dashed" onClick={onPick} disabled={busy} aria-busy={busy}>
          {busy ? <SpinnerIcon size={36} className="empty-spinner" /> : <BeeMark size={56} className="mascot-svg" />}
          <span className="empty-title">{busy ? 'Opening specimen...' : 'Drop a specimen on the bench'}</span>
          <span className="empty-sub">PNG, JPG or WEBP, up to 30 MB, or paste</span>
          <span className="empty-cta">Choose an image</span>
        </button>
        {onLoadSample ? (
          <button
            type="button"
            className="btn-quiet empty-sample-btn"
            onClick={onLoadSample}
            disabled={busy}
          >
            Or load the Koi Pond specimen
          </button>
        ) : null}
      </div>
    </div>
  );
}
