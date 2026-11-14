import { describe, expect, it } from 'vitest';
import { clampCompare, compareFromPointer, compareStep, compareValueText } from './compare';

const rect = { left: 100, width: 200 } as DOMRect;

describe('compare rule', () => {
  it('clamps the position to 0–100', () => {
    expect(clampCompare(-20)).toBe(0);
    expect(clampCompare(140)).toBe(100);
    expect(clampCompare(50.4)).toBe(50);
  });

  it('converts pointer position to a percentage', () => {
    expect(compareFromPointer(100, rect)).toBe(0);
    expect(compareFromPointer(200, rect)).toBe(50);
    expect(compareFromPointer(400, rect)).toBe(100);
    expect(compareFromPointer(120, { left: 0, width: 0 } as DOMRect)).toBe(50);
  });

  it('steps with arrows and jumps with Home and End', () => {
    expect(compareStep(50, 'ArrowLeft')).toBe(48);
    expect(compareStep(50, 'ArrowRight')).toBe(52);
    expect(compareStep(50, 'ArrowRight', true)).toBe(60);
    expect(compareStep(5, 'ArrowLeft', true)).toBe(0);
    expect(compareStep(50, 'Home')).toBe(0);
    expect(compareStep(50, 'End')).toBe(100);
  });

  it('describes the value for assistive tech', () => {
    expect(compareValueText(42)).toBe('Compare at 42 percent');
  });
});
