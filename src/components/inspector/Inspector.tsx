import { STAGE_LABELS } from '../../lib/stages';
import type {
  ConverterSettings,
  ExportSize,
  GridPreset,
  GridSize,
  ProcessedImage,
  SourceImage,
  Stage,
} from '../../types';
import { ColorPanel } from './ColorPanel';
import { ExportTicket } from './ExportTicket';
import { FinishPanel } from './FinishPanel';
import { GridPanel } from './GridPanel';
import { ImagePanel } from './ImagePanel';

interface InspectorProps {
  active: Stage;
  source: SourceImage | null;
  settings: ConverterSettings;
  grid: GridSize;
  pixelSize: number;
  processed: ProcessedImage | null;
  finalSize: ExportSize;
  error: string | null;
  busy: boolean;
  downloading: boolean;
  disabledReason: string | null;
  onUpdate: (patch: Partial<ConverterSettings>) => void;
  onPreset: (preset: GridPreset) => void;
  onPixelSize: (size: number) => void;
  onGridDimension: (side: 'width' | 'height', value: number) => void;
  onGridAspectLocked: (locked: boolean) => void;
  onOutputDimension: (side: 'width' | 'height', value: number) => void;
  onOutputAuto: () => void;
  onPick: () => void;
  onRemove: () => void;
  onDismissError: () => void;
  onResetStage: () => void;
  onDownload: () => void;
}

export function Inspector({
  active,
  source,
  settings,
  grid,
  pixelSize,
  processed,
  finalSize,
  error,
  busy,
  downloading,
  disabledReason,
  onUpdate,
  onPreset,
  onPixelSize,
  onGridDimension,
  onGridAspectLocked,
  onOutputDimension,
  onOutputAuto,
  onPick,
  onRemove,
  onDismissError,
  onResetStage,
  onDownload,
}: InspectorProps) {
  return (
    <aside className="inspector" aria-label={`${STAGE_LABELS[active]} controls`}>
      <div className="inspector-head">
        <h2>{STAGE_LABELS[active]}</h2>
        {active !== 'image' ? (
          <button type="button" className="text-btn" onClick={onResetStage} disabled={!source}>
            Reset {STAGE_LABELS[active]}
          </button>
        ) : null}
      </div>

      <div className="inspector-body">
        <div key={active} className="stage-panel-enter">
          {active === 'image' ? (
            <ImagePanel
              source={source}
              error={error}
              busy={busy}
              onPick={onPick}
              onRemove={onRemove}
              onDismissError={onDismissError}
            />
          ) : null}

          {active === 'grid' ? (
            <GridPanel
              settings={settings}
              grid={grid}
              pixelSize={pixelSize}
              disabled={!source}
              onPreset={onPreset}
              onPixelSize={onPixelSize}
              onGridDimension={onGridDimension}
              onGridAspectLocked={onGridAspectLocked}
            />
          ) : null}

          {active === 'color' ? (
            <ColorPanel
              settings={settings}
              palette={processed?.palette ?? []}
              disabled={!source}
              onUpdate={onUpdate}
            />
          ) : null}

          {active === 'finish' ? (
            <FinishPanel
              settings={settings}
              finalSize={finalSize}
              onUpdate={onUpdate}
              onOutputDimension={onOutputDimension}
              onOutputAuto={onOutputAuto}
            />
          ) : null}
        </div>
      </div>

      <ExportTicket
        settings={settings}
        finalSize={finalSize}
        processed={processed}
        downloading={downloading}
        disabledReason={disabledReason}
        onUpdate={onUpdate}
        onDownload={onDownload}
      />
    </aside>
  );
}
