import { FORMAT_META, SCALE_FACTORS } from '../../constants';
import { ticketDownloadLabel, ticketOutput } from '../../lib/ticket';
import type { ConverterSettings, ExportFormat, ExportSize, ProcessedImage, ScaleFactor } from '../../types';
import { ExportIcon, SpinnerIcon } from '../icons';
import { ColorField } from '../ui/ColorField';
import { Segmented } from '../ui/Segmented';

interface ExportTicketProps {
  settings: ConverterSettings;
  finalSize: ExportSize;
  processed: ProcessedImage | null;
  downloading: boolean;
  disabledReason: string | null;
  onUpdate: (patch: Partial<ConverterSettings>) => void;
  onDownload: () => void;
}

export function ExportTicket({
  settings,
  finalSize,
  processed,
  downloading,
  disabledReason,
  onUpdate,
  onDownload,
}: ExportTicketProps) {
  const disabled = Boolean(disabledReason) || !processed || downloading;
  const blocked = Boolean(processed && disabledReason);

  return (
    <section className="ticket" aria-label="Export ticket">
      <div className="ticket-head">
        <span>Export</span>
      </div>

      <div className="ticket-row">
        <span className="ticket-label">Format</span>
        <Segmented<ExportFormat>
          label="Export format"
          className="ticket-seg"
          value={settings.format}
          onChange={(value) => onUpdate({ format: value })}
          options={[
            { value: 'png', label: FORMAT_META.png.label },
            { value: 'jpeg', label: FORMAT_META.jpeg.label },
            { value: 'webp', label: FORMAT_META.webp.label },
          ]}
        />
      </div>

      <div className="ticket-row">
        <span className="ticket-label">Scale</span>
        <Segmented<ScaleFactor>
          label="Export scale multiplier"
          className="ticket-seg"
          value={settings.scale}
          onChange={(value) => onUpdate({ scale: value })}
          options={SCALE_FACTORS.map((factor) => ({ value: factor, label: `${factor}×` }))}
        />
      </div>

      <div className="ticket-row">
        <span className="ticket-label">Alpha</span>
        <Segmented<'transparent' | 'colour'>
          label="Export background"
          className="ticket-seg"
          value={settings.transparentBackground ? 'transparent' : 'colour'}
          onChange={(value) => onUpdate({ transparentBackground: value === 'transparent' })}
          options={[
            { value: 'transparent', label: 'Transparent' },
            { value: 'colour', label: 'Color' },
          ]}
        />
      </div>

      {!settings.transparentBackground ? (
        <ColorField
          label="Color"
          value={settings.backgroundColor}
          onChange={(value) => onUpdate({ backgroundColor: value })}
        />
      ) : null}

      <div className="ticket-output">
        <span>Output</span>
        <b className={blocked ? 'is-danger tnum' : 'tnum'}>{ticketOutput(finalSize)}</b>
      </div>

      <button
        type="button"
        className="ticket-download"
        onClick={onDownload}
        disabled={disabled}
        aria-busy={downloading}
      >
        {downloading ? <SpinnerIcon size={16} /> : <ExportIcon size={16} />}
        {downloading ? 'Encoding...' : ticketDownloadLabel(settings.format)}
      </button>

      {disabledReason ? <p className="ticket-reason">{disabledReason}</p> : null}
    </section>
  );
}
