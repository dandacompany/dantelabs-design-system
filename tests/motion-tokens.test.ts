import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { parseCustomProperties, resolveToken } from './helpers/parse-css';
import { loadJsonTokens } from './helpers/load-json-tokens';

const CSS = resolve(__dirname, '../css/tokens.css');
const JSON_PATH = resolve(__dirname, '../tokens/motion.json');

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;
let cssRaw: string;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
  cssRaw = readFileSync(CSS, 'utf8');
});

const EASE_KEYS = ['page', 'ink', 'fold'] as const;
const DURATION_KEYS = ['fast', 'base', 'slow'] as const;

describe('Easing tokens are valid cubic-bezier', () => {
  for (const key of EASE_KEYS) {
    it(`--ease-${key} is a valid cubic-bezier 4-tuple`, () => {
      const value = resolveToken(`ease-${key}`, cssTokens);
      const match = value.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);
      expect(match, `--ease-${key} value: ${value}`).not.toBeNull();
    });
    it(`ease.${key} JSON has cubicBezier $type`, () => {
      const node = jsonTokens.get(`ease.${key}`);
      expect(node).toBeDefined();
      expect(node!.$type).toBe('cubicBezier');
    });
  }
});

describe('Duration tokens are positive integer ms', () => {
  for (const key of DURATION_KEYS) {
    it(`--duration-${key} is positive integer with ms unit`, () => {
      const value = resolveToken(`duration-${key}`, cssTokens);
      const match = value.match(/^(\d+)ms$/);
      expect(match, `--duration-${key} value: ${value}`).not.toBeNull();
      expect(parseInt(match![1], 10)).toBeGreaterThan(0);
    });
    it(`duration.${key} matches CSS`, () => {
      const cssValue = resolveToken(`duration-${key}`, cssTokens);
      const jsonValue = String(jsonTokens.get(`duration.${key}`)!.$value);
      expect(cssValue).toBe(jsonValue);
    });
  }
});

describe('Duration ramp is monotonically increasing', () => {
  it('fast < base < slow', () => {
    const ms = (k: string) => parseInt(resolveToken(`duration-${k}`, cssTokens).replace('ms', ''), 10);
    expect(ms('fast')).toBeLessThan(ms('base'));
    expect(ms('base')).toBeLessThan(ms('slow'));
  });
});

describe('prefers-reduced-motion override', () => {
  it('CSS contains @media (prefers-reduced-motion: reduce) with 0ms overrides', () => {
    expect(cssRaw).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    const reduceBlock = cssRaw.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\n\}/);
    expect(reduceBlock, 'reduce-motion block').not.toBeNull();
    expect(reduceBlock![0]).toMatch(/--duration-fast:\s*0ms/);
    expect(reduceBlock![0]).toMatch(/--duration-base:\s*0ms/);
    expect(reduceBlock![0]).toMatch(/--duration-slow:\s*0ms/);
  });
});
