import { memo } from 'react';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ColorField = memo(({ label, value, onChange, disabled }: ColorFieldProps) => {
  return (
    <label className={`color-field${disabled ? ' is-disabled' : ''}`}>
      <span className="color-label">{label}</span>
      <span className="color-input-wrap">
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <code>{value.toUpperCase()}</code>
      </span>
    </label>
  );
});
