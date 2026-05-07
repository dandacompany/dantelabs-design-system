import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { parseCustomProperties, resolveToken } from './helpers/parse-css';
import { loadJsonTokens } from './helpers/load-json-tokens';

const CSS = resolve(__dirname, '../css/tokens.css');
const JSON_PATH = resolve(__dirname, '../tokens/spacing.json');

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
});

const NUMERIC_MAPPING: Record<string, string> = {
  'space-1': 'space.1',
  'space-2': 'space.2',
  'space-3': 'space.3',
  'space-4': 'space.4',
  'space-5': 'space.5',
  'space-6': 'space.6',
  'space-7': 'space.7',
  'space-8': 'space.8',
  'space-9': 'space.9',
};

const ALIAS_MAPPING: Record<string, string> = {
  'space-xs': 'space-1',
  'space-sm': 'space-2',
  'space-md': 'space-4',
  'space-lg': 'space-6',
  'space-xl': 'space-8',
};

describe('CSS ↔ JSON spacing token parity', () => {
  for (const [cssVar, jsonPath] of Object.entries(NUMERIC_MAPPING)) {
    it(`--${cssVar} matches ${jsonPath}`, () => {
      const cssValue = resolveToken(cssVar, cssTokens);
      const jsonNode = jsonTokens.get(jsonPath);
      expect(jsonNode, `JSON path ${jsonPath}`).toBeDefined();
      expect(cssValue).toBe(String(jsonNode!.$value));
    });
  }
});

describe('Spacing aliases resolve to numeric tokens', () => {
  for (const [aliasVar, targetVar] of Object.entries(ALIAS_MAPPING)) {
    it(`--${aliasVar} resolves to same value as --${targetVar}`, () => {
      expect(resolveToken(aliasVar, cssTokens)).toBe(resolveToken(targetVar, cssTokens));
    });
  }
});
