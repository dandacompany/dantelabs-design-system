import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { contrastRatio } from './helpers/contrast';
import { parseCustomProperties, resolveToken } from './helpers/parse-css';

const TOKENS_PATH = resolve(__dirname, '../css/tokens.css');
let tokens: Map<string, string>;

beforeAll(() => {
  tokens = parseCustomProperties(TOKENS_PATH);
});

function token(name: string): string {
  return resolveToken(name, tokens);
}

describe('WCAG AA 명암비 (spec §2.3)', () => {
  it('ink ↔ paper: AAA (7:1)', () => {
    expect(contrastRatio(token('color-ink'), token('color-paper')))
      .toBeGreaterThanOrEqual(7);
  });

  it('link-strong ↔ paper: AA body (4.5:1)', () => {
    expect(contrastRatio(token('color-link-strong'), token('color-paper')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('link ↔ paper: AA large only (3:1)', () => {
    const ratio = contrastRatio(token('color-link'), token('color-paper'));
    expect(ratio).toBeGreaterThanOrEqual(3);
    expect(ratio).toBeLessThan(4.5);
  });

  it('slate ↔ paper: AA body (4.5:1)', () => {
    expect(contrastRatio(token('color-slate'), token('color-paper')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('rust ↔ paper: AA large (3:1)', () => {
    expect(contrastRatio(token('color-rust'), token('color-paper')))
      .toBeGreaterThanOrEqual(3);
  });

  it('sepia ↔ paper: AA large (3:1)', () => {
    expect(contrastRatio(token('color-sepia'), token('color-paper')))
      .toBeGreaterThanOrEqual(3);
  });
});

describe('Semantic aliases resolve to primitives (spec §4.1)', () => {
  it('text-link resolves to link-strong hex', () => {
    expect(token('text-link')).toBe(token('color-link-strong'));
  });

  it('state-danger resolves to rust hex', () => {
    expect(token('state-danger')).toBe(token('color-rust'));
  });

  it('bg-canvas resolves to paper hex', () => {
    expect(token('bg-canvas')).toBe(token('color-paper'));
  });
});
