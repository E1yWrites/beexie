import { MAX_OUTPUT_DIMENSION } from '../../constants';
import type { ConverterSettings, ExportSize } from '../../types';
import { LinkIcon, UnlinkIcon } from '../icons';
import { NumberField } from '../ui/NumberField';
import { Slider } from '../ui/Slider';

interface FinishPanelProps {
  settings: ConverterSettings;
  finalSize: ExportSize;
  onUpdate: (patch: Partial<ConverterSettings>) => void;
  onOutputDimension: (side: 'width' | 'height', value: number) => void;
  onOutputAuto: () => void;
  chartDisabled: boolean;
  onChart: () => void;
  onSaveLook: () => void;
  onLoadLook: (file: File) => void;
}

export function FinishPanel({
  settings,
  finalSize,
  onUpdate,
  onOutputDimension,
  onOutputAuto,
  chartDisabled,
  onChart,
  onSaveLook,
  onLoadLook,
}: FinishPanelProps) {
  return (
    <div className="panel-body">
      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Output dimensions</span>
          <button
            type="button"
            className="text-btn"
            onClick={onOutputAuto}
            disabled={settings.outputAuto}
            title="Fit the output to the art grid"
          >
            {settings.outputAuto ? 'Auto' : 'Reset to auto'}
          </button>
        </div>
        <div className="dims">
          <NumberField
            label="Width"
            value={settings.outputWidth}
            min={1}
            max={MAX_OUTPUT_DIMENSION}
            suffix="px"
            onCommit={(value) => onOutputDimension('width', value)}
          />
          <span className="dim-sep" aria-hidden="true">
            &times;
          </span>
          <NumberField
            label="Height"
            value={settings.outputHeight}
            min={1}
            max={MAX_OUTPUT_DIMENSION}
            suffix="px"
            onCommit={(value) => onOutputDimension('height', value)}
          />
          <button
            type="button"
            className={`chain${settings.outputAspectLocked ? ' is-active' : ''}`}
            aria-pressed={settings.outputAspectLocked}
            aria-label={settings.outputAspectLocked ? 'Unlock output aspect ratio' : 'Lock output aspect ratio'}
            title={settings.outputAspectLocked ? 'Aspect ratio locked' : 'Aspect ratio free'}
            onClick={() => onUpdate({ outputAspectLocked: !settings.outputAspectLocked })}
          >
            {settings.outputAspectLocked ? <LinkIcon size={15} /> : <UnlinkIcon size={15} />}
          </button>
        </div>
        <p className="field-hint">
          Base size before scale. Export outputs{' '}
          <span className="tnum">{finalSize.width} &times; {finalSize.height}</span> px.
        </p>
      </div>

      {settings.format === 'jpeg' || settings.format === 'webp' ? (
        <div className="panel-group">
          <Slider
            label="Quality"
            value={Math.round(settings.quality * 100)}
            min={10}
            max={100}
            onChange={(value) => onUpdate({ quality: value / 100 })}
            formatValue={(value) => <span className="mono tnum">{value}%</span>}
            hint={settings.format === 'jpeg' ? 'Higher quality means larger JPG files.' : 'WEBP balances size and quality.'}
          />
        </div>
      ) : null}

      <div className="panel-group">
        <div className="readout">
          <span>Final file</span>
          <strong className="tnum">
            {finalSize.width} &times; {finalSize.height} px
          </strong>
        </div>

        {settings.format === 'jpeg' && settings.transparentBackground ? (
          <p className="panel-note is-danger">JPG cannot store transparency. The background color is used instead.</p>
        ) : null}

        <p className="panel-note">Format, scale and background are set on the ticket below across every stage.</p>
      </div>

      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Maker chart</span>
        </div>
        <button type="button" className="btn-secondary" disabled={chartDisabled} onClick={onChart}>
          Download maker chart
        </button>
        <p className="panel-note">A printable PNG for beads and cross-stitch: one symbol per color, rulers every 10 cells, and a legend with each color's count.</p>
      </div>

      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Looks</span>
        </div>
        <div className="palette-io-row">
          <button type="button" className="btn-secondary" onClick={onSaveLook}>
            Save look
          </button>
          <label className="btn-secondary palette-file">
            Load look
            <input
              className="visually-hidden"
              type="file"
              accept=".json,application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onLoadLook(file);
                event.target.value = '';
              }}
            />
          </label>
        </div>
        <p className="panel-note">A look is every setting as a small JSON file, to reuse on other images or share. beexie also remembers your last look on this device.</p>
      </div>
    </div>
  );
}
