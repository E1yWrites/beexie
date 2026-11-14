import { useCallback, useState } from 'react';
import type { Stage } from '../types';

/** Stage navigation. UI-only: it never touches processing inputs. */
export function useTool(initial: Stage = 'image') {
  const [active, setActive] = useState<Stage>(initial);
  const [visited, setVisited] = useState<ReadonlySet<Stage>>(() => new Set<Stage>([initial]));

  const open = useCallback((stage: Stage) => {
    setActive(stage);
    setVisited((previous) => {
      if (previous.has(stage)) return previous;
      const next = new Set(previous);
      next.add(stage);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setActive('image');
    setVisited(new Set<Stage>(['image']));
  }, []);

  return { active, visited, open, reset } as const;
}
