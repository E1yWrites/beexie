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
        <button type="button" className="empty-bench" onClick={onPick} disabled={busy} aria-busy={busy}>
          {busy ? <SpinnerIcon size={36} className="empty-spinner" /> : <BeeMark size={56} className="mascot-svg" />}
          <span className="empty-title">{busy ? 'Opening image...' : 'Drop an image on the page'}</span>
          <span className="empty-sub">PNG, JPG or WEBP up to 30 MB. Paste works too.</span>
          <span className="empty-cta">Choose an image</span>
        </button>
        {onLoadSample ? (
          <button
            type="button"
            className="btn-quiet empty-sample-btn"
            onClick={onLoadSample}
            disabled={busy}
          >
            Or try the koi sample
          </button>
        ) : null}
      </div>
    </div>
  );
}
