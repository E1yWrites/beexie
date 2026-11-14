import { useId, useMemo } from 'react';
import { useElementSize } from '../../hooks/useElementSize';
import { paletteRows } from '../../lib/palette';

interface PaletteCombProps {
  colors: readonly string[];
  editable?: boolean;
  selected?: number | null;
  onSelect?: (index: number) => void;
  onRemove?: (index: number) => void;
  onAdd?: () => void;
  label?: string;
}

export function PaletteComb({
  colors,
  editable = false,
  selected = null,
  onSelect,
  onRemove,
  onAdd,
  label = 'Active palette',
}: PaletteCombProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const idBase = useId();
  const perRow = size.width > 0 ? Math.max(4, Math.min(8, Math.floor((size.width + 5) / 36))) : 8;
  const rows = useMemo(() => paletteRows(colors, perRow), [colors, perRow]);

  const move = (from: number, step: number) => {
    if (!onSelect || colors.length === 0) return;
    const next = (from + step + colors.length) % colors.length;
    onSelect(next);
  };

  return (
    <div
      ref={ref}
      className={`comb${editable ? ' is-editable' : ''}`}
      role={editable ? 'listbox' : 'list'}
      aria-label={editable ? `${label}. Use arrow keys to choose a color.` : `${label}, ${colors.length} colors`}
      aria-activedescendant={editable && selected !== null ? `${idBase}-${selected}` : undefined}
      tabIndex={editable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!editable) return;
        if (selected === null) {
          if (event.key.startsWith('Arrow') || event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            onSelect?.(0);
          }
          return;
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          move(selected, 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          move(selected, -1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          onSelect?.(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          onSelect?.(colors.length - 1);
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
          if (colors.length > 2) {
            event.preventDefault();
            onRemove?.(selected);
          }
        }
      }}
    >
      {rows.map((row, rowIndex) => (
        <div className="comb-row" key={`row-${rowIndex}`} role="presentation">
          {row.map((color, columnIndex) => {
            const index = rowIndex * perRow + columnIndex;
            const isSelected = selected === index;
            const cell = (
              <span className="comb-hex" style={{ ['--c' as string]: color, ['--i' as string]: index }}>
                <i />
              </span>
            );

            if (!editable) {
              return (
                <span className="comb-cell" key={`${color}-${index}`} title={color} role="listitem" aria-label={`Color ${index + 1}, ${color}`}>
                  {cell}
                </span>
              );
            }

            return (
              <button
                key={`${color}-${index}`}
                type="button"
                id={`${idBase}-${index}`}
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                aria-label={`Color ${index + 1}, ${color}`}
                className={`comb-cell${isSelected ? ' is-selected' : ''}`}
                onClick={() => onSelect?.(index)}
              >
                {cell}
              </button>
            );
          })}

          {editable && onAdd && rowIndex === rows.length - 1 ? (
            <button type="button" className="comb-cell comb-add" aria-label="Add a palette color" onClick={onAdd}>
              <span className="comb-add-mark" aria-hidden="true">
                +
              </span>
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
