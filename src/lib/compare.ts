import { clamp } from './dimensions';

export const COMPARE_MIN = 0;
export const COMPARE_MAX = 100;

export function clampCompare(value: number): number {
  return clamp(Math.round(value), COMPARE_MIN, COMPARE_MAX);
}

export function compareFromPointer(clientX: number, rect: DOMRect): number {
  if (rect.width <= 0) return COMPARE_MAX / 2;
  return clampCompare(((clientX - rect.left) / rect.width) * 100);
}

export type CompareKey = 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

/** Keyboard step for the compare rule. Shift moves in larger increments. */
export function compareStep(value: number, key: CompareKey, shift = false): number {
  const step = shift ? 10 : 2;
  switch (key) {
    case 'ArrowLeft':
      return clampCompare(value - step);
    case 'ArrowRight':
      return clampCompare(value + step);
    case 'Home':
      return COMPARE_MIN;
    case 'End':
      return COMPARE_MAX;
    default:
      return value;
  }
}

export function compareValueText(value: number): string {
  return `Compare at ${Math.round(value)} percent`;
}
