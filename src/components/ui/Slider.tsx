import { memo, useId, type CSSProperties, type ReactNode } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => ReactNode;
  hint?: string;
  disabled?: boolean;
}

export const Slider = memo(
  ({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    formatValue,
    hint,
    disabled,
  }: SliderProps) => {
    const id = useId();
    const display = formatValue ? formatValue(value) : String(value);
    const pct = Math.max(0, Math.min(100, ((value - min) / Math.max(1, max - min)) * 100));

    return (
      <div className={`field${disabled ? ' is-disabled' : ''}`}>
        <div className="field-head">
          <label htmlFor={id}>{label}</label>
          <output htmlFor={id} className="field-value">
            {display}
          </output>
        </div>
        <input
          id={id}
          className="range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          style={{ '--slider-pct': `${pct}%` } as CSSProperties}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {hint ? <p className="field-hint">{hint}</p> : null}
      </div>
    );
  },
);
