interface IconProps {
  size?: number;
  className?: string;
}

function frame(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    className,
  };
}

/** Reimagined Spot-Ink geometric ink-stamp bee emblem. */
export function BeeMark({ size = 28, className }: IconProps) {
  const height = Math.round((size * 28) / 32);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 32 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M9 9C5 5 2 8 4 12C6 15 10 13 12 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 9C27 5 30 8 28 12C26 15 22 13 20 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="7" width="8" height="16" rx="4" fill="var(--panel)" stroke="currentColor" strokeWidth="1.9" />
      <line x1="12" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.9" />
      <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.9" />
      <line x1="13" y1="20" x2="19" y2="20" stroke="var(--vermilion, #eb4a2d)" strokeWidth="1.9" />
      <line x1="14" y1="7" x2="11" y2="3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="18" y1="7" x2="21" y2="3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SpinnerIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...frame(size, className ? `icon-spin ${className}` : 'icon-spin')}>
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}

export function SunIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </svg>
  );
}

export function PlusIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ResetIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function UploadIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}

export function DownloadIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M12 15V3M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  );
}

export function LinkIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

export function UnlinkIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M15 7l2-2a4 4 0 0 1 6 6l-2 2" />
      <path d="M9 17l-2 2a4 4 0 0 1-6-6l2-2" />
      <path d="M8 3v3M3 8h3M16 21v-3M21 16h-3" />
    </svg>
  );
}

export function CloseIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ImageIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4 18 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

export function GridIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ColorIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a2 2 0 0 1 0-4h4a3 3 0 0 0 3-3c0-3.3-3.6-6-8-6Z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="9" cy="6.8" r="1" />
      <circle cx="14" cy="6.5" r="1" />
    </svg>
  );
}

export function ExportIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="M12 15V3" />
      <path d="m8 11 4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function CheckIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...frame(size, className)}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}
