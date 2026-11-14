import { memo, useEffect, useState } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
  disabled?: boolean;
  suffix?: string;
}

export const NumberField = memo(({ label, value, min, max, onCommit, disabled, suffix }: NumberFieldProps) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = Number(draft);
    if (Number.isFinite(parsed)) onCommit(parsed);
    else setDraft(String(value));
  };

  return (
    <label className={`number-field${disabled ? ' is-disabled' : ''}`}>
      <span className="number-label">{label}</span>
      <span className="number-input-wrap">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            } else if (event.key === 'Escape') {
              setDraft(String(value));
              event.currentTarget.blur();
            }
          }}
        />
        {suffix ? <span className="number-suffix">{suffix}</span> : null}
      </span>
    </label>
  );
});
