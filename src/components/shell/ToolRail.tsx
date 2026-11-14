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

const SHORT_LABELS: Record<Stage, string> = {
  image: 'Intake',
  grid: 'Grid',
  color: 'Color',
  finish: 'Finish',
};

export function ToolRail({ active, source, settings, grid, paletteSize, onOpen }: ToolRailProps) {
  return (
    <nav className="rail" aria-label="Studio stages">
      <div className="rail-list">
        {STAGE_ORDER.map((stage, index) => {
          const meta = stageMeta(stage, { source, grid, settings, paletteSize });
          const state = stageState(stage, active, new Set<Stage>());
          const isActive = stage === active;
          const num = String(index + 1).padStart(2, '0');
          return (
            <button
              key={stage}
              type="button"
              className={`tool${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'step' : undefined}
              aria-label={stageAriaLabel(stage, state, meta)}
              title={`${num} ${STAGE_LABELS[stage]} · ${meta}`}
              onClick={() => onOpen(stage)}
            >
              <span className="tool-num" aria-hidden="true">
                {num}
              </span>
              <span className="tool-label">{SHORT_LABELS[stage]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
