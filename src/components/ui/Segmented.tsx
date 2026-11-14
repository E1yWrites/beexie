import { type ReactNode } from 'react';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: ReactNode;
  title?: string;
  disabled?: boolean;
}

interface SegmentedProps<T extends string | number> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  const enabled = options.filter((option) => !option.disabled);

  const move = (from: T, direction: 1 | -1) => {
    if (enabled.length === 0) return;
    const index = enabled.findIndex((option) => option.value === from);
    const start = index === -1 ? 0 : index;
    const next = (start + direction + enabled.length) % enabled.length;
    onChange(enabled[next].value);
  };

  return (
    <div
      className={className ? `segmented ${className}` : 'segmented'}
      role="group"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          move(value, -1);
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          move(value, 1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          if (enabled[0]) onChange(enabled[0].value);
        } else if (event.key === 'End') {
          event.preventDefault();
          if (enabled.length > 0) onChange(enabled[enabled.length - 1].value);
        }
      }}
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          className="segmented-option"
          aria-pressed={option.value === value}
          aria-label={typeof option.label === 'string' ? option.label : undefined}
          title={option.title}
          disabled={option.disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
