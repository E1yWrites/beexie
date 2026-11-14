import { STAGE_LABELS, STAGE_ORDER, stageAriaLabel, stageMeta, stageState } from '../../lib/stages';
import type { ConverterSettings, GridSize, SourceImage, Stage } from '../../types';

interface ToolRailProps {
  active: Stage;
  source: SourceImage | null;
  settings: ConverterSettings;
  grid: GridSize;
  paletteSize: number;
  onOpen: (stage: Stage) => void;
}

/** Thumb-index tabs cut into the page edge; the open tab floods its stage plate. */
export function ToolRail({ active, source, settings, grid, paletteSize, onOpen }: ToolRailProps) {
  return (
    <nav className="tabs" aria-label="Studio stages">
      {STAGE_ORDER.map((stage, index) => {
        const meta = stageMeta(stage, { source, grid, settings, paletteSize });
        const state = stageState(stage, active, new Set<Stage>());
        const isActive = stage === active;
        return (
          <button
            key={stage}
            type="button"
            className={`tab tab-${stage}${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'step' : undefined}
            aria-label={stageAriaLabel(stage, state, meta)}
            title={`${STAGE_LABELS[stage]}: ${meta}`}
            aria-controls="stage-inspector"
            onClick={(event) => {
              onOpen(stage);
              // Keyboard activation (detail 0) jumps past the preview toolbar straight to the stage controls.
              if (event.detail === 0) requestAnimationFrame(() => document.getElementById('stage-inspector')?.focus());
            }}
          >
            <span className="tab-num pixel" aria-hidden="true">
              {index + 1}
            </span>
            <span className="tab-label">{STAGE_LABELS[stage]}</span>
          </button>
        );
      })}
    </nav>
  );
}
