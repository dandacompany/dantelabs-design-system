import { describe, it, expect } from 'vitest';
import { contrastRatio } from './helpers/contrast';

describe('WCAG contrast ratio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('returns 1 for same color', () => {
    expect(contrastRatio('#F7F2E6', '#F7F2E6')).toBeCloseTo(1, 1);
  });

  it('ink on paper exceeds WCAG AAA (7:1)', () => {
    const ratio = contrastRatio('#1a1a1a', '#F7F2E6');
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  it('link-strong on paper meets WCAG AA (4.5:1)', () => {
    const ratio = contrastRatio('#3E5E75', '#F7F2E6');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#A0522D', '#F7F2E6')).toBeCloseTo(
      contrastRatio('#F7F2E6', '#A0522D'),
      2
    );
  });

  it('accepts 3-digit hex', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 0);
  });
});
