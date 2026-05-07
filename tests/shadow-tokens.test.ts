import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { parseCustomProperties, resolveToken } from './helpers/parse-css';
import { loadJsonTokens } from './helpers/load-json-tokens';

const CSS = resolve(__dirname, '../css/tokens.css');
const JSON_PATH = resolve(__dirname, '../tokens/shadow.json');

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
});

const SHADOW_KEYS = ['none', 'sm', 'md', 'lg', 'xl'] as const;

describe('Shadow tokens defined in both CSS and JSON', () => {
  for (const key of SHADOW_KEYS) {
    it(`--shadow-${key} exists in CSS`, () => {
      expect(cssTokens.has(`shadow-${key}`)).toBe(true);
    });
    it(`shadow.${key} exists in JSON`, () => {
      expect(jsonTokens.get(`shadow.${key}`)).toBeDefined();
    });
  }
});

describe('Shadow values use ink-tint only (no color shadows)', () => {
  const FORBIDDEN_HEX = ['#a0522d', '#8b6f47', '#435b6c', '#5b7f99', '#3e5e75', '#c9a857', '#ebc65b'];
  for (const key of SHADOW_KEYS) {
    if (key === 'none') continue;
    it(`--shadow-${key} contains no brand color hex`, () => {
      const value = resolveToken(`shadow-${key}`, cssTokens).toLowerCase();
      for (const hex of FORBIDDEN_HEX) {
        expect(value, `--shadow-${key} must not contain ${hex}`).not.toContain(hex);
      }
    });
    it(`--shadow-${key} uses rgba(26,26,26,...) ink tint`, () => {
      const value = resolveToken(`shadow-${key}`, cssTokens);
      expect(value).toMatch(/rgba\(\s*26\s*,\s*26\s*,\s*26\s*,/);
    });
  }
});

describe('Shadow ramp opacity is monotonically increasing', () => {
  it('sm < md < lg < xl by drop-shadow alpha', () => {
    const extractLastAlpha = (s: string): number => {
      const matches = [...s.matchAll(/rgba\(26\s*,\s*26\s*,\s*26\s*,\s*([\d.]+)\)/g)];
      return parseFloat(matches[matches.length - 1][1]);
    };
    const sm = extractLastAlpha(resolveToken('shadow-sm', cssTokens));
    const md = extractLastAlpha(resolveToken('shadow-md', cssTokens));
    const lg = extractLastAlpha(resolveToken('shadow-lg', cssTokens));
    const xl = extractLastAlpha(resolveToken('shadow-xl', cssTokens));
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
  });
});
