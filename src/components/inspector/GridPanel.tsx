import { GRID_PRESETS, MAX_GRID } from '../../constants';
import type { ConverterSettings, GridPreset, GridSize } from '../../types';
import { LinkIcon, UnlinkIcon } from '../icons';
import { NumberField } from '../ui/NumberField';
import { Slider } from '../ui/Slider';

interface GridPanelProps {
  settings: ConverterSettings;
  grid: GridSize;
  pixelSize: number;
  disabled: boolean;
  onPreset: (preset: GridPreset) => void;
  onPixelSize: (size: number) => void;
  onGridDimension: (side: 'width' | 'height', value: number) => void;
  onGridAspectLocked: (locked: boolean) => void;
}

const PRESET_HINTS: Record<GridPreset, string> = {
  8: 'Draft',
  16: 'Tiny',
  32: 'Small',
  64: 'Balanced',
  128: 'Fine',
  256: 'Max',
};

export function GridPanel({
  settings,
  grid,
  pixelSize,
  disabled,
  onPreset,
  onPixelSize,
  onGridDimension,
  onGridAspectLocked,
}: GridPanelProps) {
  return (
    <div className="panel-body">
      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Resolution presets</span>
        </div>
        <div className="presets" role="group" aria-label="Pixel resolution presets">
          {GRID_PRESETS.map((preset) => {
            const active = settings.resolutionMode === 'preset' && settings.preset === preset;
            return (
              <button
                key={preset}
                type="button"
                className={`preset${active ? ' is-active' : ''}`}
                aria-pressed={active}
                disabled={disabled}
                onClick={() => onPreset(preset)}
              >
                <b className="tnum">{preset}</b>
                <span>{PRESET_HINTS[preset]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel-group">
        <div className="field-head">
          <span className="field-label">Exact grid dimensions</span>
        </div>
        <div className="dims">
          <NumberField
            label="Width"
            value={grid.width}
            min={1}
            max={MAX_GRID}
            disabled={disabled}
            suffix="px"
            onCommit={(value) => onGridDimension('width', value)}
          />
          <span className="dim-sep" aria-hidden="true">
            &times;
          </span>
          <NumberField
            label="Height"
            value={grid.height}
            min={1}
            max={MAX_GRID}
            disabled={disabled}
            suffix="px"
            onCommit={(value) => onGridDimension('height', value)}
          />
          <button
            type="button"
            className={`chain${settings.gridAspectLocked ? ' is-active' : ''}`}
            aria-pressed={settings.gridAspectLocked}
            aria-label={settings.gridAspectLocked ? 'Unlock grid aspect ratio' : 'Lock grid aspect ratio'}
            title={settings.gridAspectLocked ? 'Aspect ratio locked' : 'Aspect ratio free'}
            disabled={disabled}
            onClick={() => onGridAspectLocked(!settings.gridAspectLocked)}
          >
            {settings.gridAspectLocked ? <LinkIcon size={15} /> : <UnlinkIcon size={15} />}
          </button>
        </div>
      </div>

      <div className="panel-group">
        <Slider
          label="Pixel size"
          value={pixelSize}
          min={1}
          max={64}
          disabled={disabled}
          onChange={onPixelSize}
          formatValue={(value) => (
            <>
              <span className="mono tnum">{value}</span> src px
            </>
          )}
          hint="Source pixels merged into each art pixel."
        />
      </div>

      <p className="panel-note">Presets set the longest side. The other side follows your image unless the chain is unlocked.</p>
    </div>
  );
}
