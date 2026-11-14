import { useEffect, useState } from 'react';
import { FORMAT_META, SCALE_FACTORS } from '../../constants';
import { ticketDownloadLabel, ticketOutput } from '../../lib/ticket';
import type { ConverterSettings, ExportFormat, ExportSize, ProcessedImage, ScaleFactor } from '../../types';
import { ExportIcon, SpinnerIcon } from '../icons';
import { ColorField } from '../ui/ColorField';
import { Segmented } from '../ui/Segmented';
import { Tick } from '../ui/Tick';

interface ExportTicketProps {
  settings: ConverterSettings;
  finalSize: ExportSize;
  processed: ProcessedImage | null;
  downloading: boolean;
  /** Timestamp of the last successful download; each new value prints the Saved stamp once. */
  savedAt: number;
  disabledReason: string | null;
  onUpdate: (patch: Partial<ConverterSettings>) => void;
  onDownload: () => void;
}

/** Full-width export bar under the bench: always visible, never squeezes the settings. */
const WIDE = '(min-width: 760px)';

/** True when the export options have room to stay open in the bar. */
function useWide(): boolean {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const onChange = () => setWide(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return wide;
}

export function ExportTicket({
  settings,
  finalSize,
  processed,
  downloading,
  savedAt,
  disabledReason,
  onUpdate,
  onDownload,
}: ExportTicketProps) {
  const [open, setOpen] = useState(false);
  const disabled = Boolean(disabledReason) || !processed || downloading;
  const blocked = Boolean(processed && disabledReason);
  const wide = useWide() || open;

  return (
    <section className="exportbar" aria-label="Export">
      <h2 className="exportbar-title">Export</h2>

      {/* Phones pin only Output and Download; the options fold away so the bar stays one row. */}
      <details className="exportbar-more" open={wide} onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary className="exportbar-summary">
          {FORMAT_META[settings.format].label} {settings.scale}x options
        </summary>
      <div className="exportbar-controls">
        <div className="exportbar-group">
          <span className="exportbar-label">Format</span>
          <Segmented<ExportFormat>
            label="Export format"
            value={settings.format}
            onChange={(value) => onUpdate({ format: value })}
            options={[
              { value: 'png', label: FORMAT_META.png.label },
              { value: 'jpeg', label: FORMAT_META.jpeg.label },
              { value: 'webp', label: FORMAT_META.webp.label },
              { value: 'svg', label: FORMAT_META.svg.label },
            ]}
          />
        </div>

        <div className="exportbar-group">
          <span className="exportbar-label">Scale</span>
          <Segmented<ScaleFactor>
            label="Export scale multiplier"
            value={settings.scale}
            onChange={(value) => onUpdate({ scale: value })}
            options={SCALE_FACTORS.map((factor) => ({ value: factor, label: `${factor}x` }))}
          />
        </div>

        <div className="exportbar-group">
          <span className="exportbar-label">Background</span>
          <Segmented<'transparent' | 'colour'>
            label="Export background"
            value={settings.transparentBackground ? 'transparent' : 'colour'}
            onChange={(value) => onUpdate({ transparentBackground: value === 'transparent' })}
            options={[
              { value: 'transparent', label: 'Clear' },
              { value: 'colour', label: 'Fill' },
            ]}
          />
        </div>

        {!settings.transparentBackground ? (
          <ColorField
            label="Fill color"
            value={settings.backgroundColor}
            onChange={(value) => onUpdate({ backgroundColor: value })}
          />
        ) : null}
      </div>
      </details>

      <div className="exportbar-out">
        <span className="exportbar-label">Output</span>
        <b className={`pixel tnum${blocked ? ' is-danger' : ''}`} aria-label={ticketOutput(finalSize)}>
          <Tick value={finalSize.width} /> x <Tick value={finalSize.height} /> px
        </b>
      </div>

      <div className="exportbar-action">
        <button
          type="button"
          className={`exportbar-download${downloading ? ' is-encoding' : ''}`}
          onClick={onDownload}
          disabled={disabled}
          aria-busy={downloading}
          aria-describedby={disabledReason ? 'export-reason' : undefined}
        >
          {downloading ? <SpinnerIcon size={16} /> : <ExportIcon size={16} />}
          {downloading ? 'Encoding...' : ticketDownloadLabel(settings.format)}
        </button>
        {savedAt > 0 ? (
          <span key={savedAt} className="exportbar-stamp" aria-hidden="true">
            Saved
          </span>
        ) : null}
        {disabledReason ? (
          <p className="exportbar-reason" id="export-reason">
            {disabledReason}
          </p>
        ) : null}
      </div>
    </section>
  );
}
