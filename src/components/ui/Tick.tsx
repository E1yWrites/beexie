import { useEffect, useRef, useState } from 'react';

const STEPS = 6;
const STEP_MS = 30;

/**
 * A readout number that rolls to its new value in six stepped frames, like a
 * sprite counter. Instant under prefers-reduced-motion. Width never changes:
 * callers render it in the fixed-width pixel face.
 */
export function Tick({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (start === value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setShown(step >= STEPS ? value : Math.round(start + ((value - start) * step) / STEPS));
      if (step >= STEPS) window.clearInterval(timer);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [value]);

  return <>{shown}</>;
}
