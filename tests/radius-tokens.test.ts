import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { parseCustomProperties, resolveToken } from './helpers/parse-css';
import { loadJsonTokens } from './helpers/load-json-tokens';

const CSS = resolve(__dirname, '../css/tokens.css');
const JSON_PATH = resolve(__dirname, '../tokens/radius.json');

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
});

const RADIUS_MAPPING: Record<string, string> = {
  'radius-none': 'radius.none',
  'radius-sm':   'radius.sm',
  'radius-md':   'radius.md',
  'radius-lg':   'radius.lg',
  'radius-full': 'radius.full',
};

describe('CSS ↔ JSON radius token parity', () => {
  for (const [cssVar, jsonPath] of Object.entries(RADIUS_MAPPING)) {
    it(`--${cssVar} matches ${jsonPath}`, () => {
      const cssValue = resolveToken(cssVar, cssTokens);
      const jsonNode = jsonTokens.get(jsonPath);
      expect(jsonNode, `JSON path ${jsonPath}`).toBeDefined();
      expect(cssValue).toBe(String(jsonNode!.$value));
    });
  }
});

describe('Radius scale invariants', () => {
  it('lg is the upper bound for non-pill shapes (8px)', () => {
    expect(resolveToken('radius-lg', cssTokens)).toBe('8px');
  });
  it('full is the explicit pill/circle exception', () => {
    expect(resolveToken('radius-full', cssTokens)).toBe('9999px');
  });
});
