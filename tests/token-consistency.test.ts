import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { parseCustomProperties, resolveToken } from './helpers/parse-css';
import { loadJsonTokens } from './helpers/load-json-tokens';

const CSS = resolve(__dirname, '../css/tokens.css');
const COLOR_JSON = resolve(__dirname, '../tokens/color.json');

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(COLOR_JSON);
});

const COLOR_MAPPING: Record<string, string> = {
  'color-paper':        'color.paper',
  'color-ink':          'color.ink',
  'color-rust':         'color.rust',
  'color-sepia':        'color.sepia',
  'color-slate':        'color.slate',
  'color-link':         'color.link',
  'color-link-strong':  'color.link-strong',
  'color-amber':        'color.amber',
  'color-mark':         'color.mark',
  'color-paper-soft':   'color.paper-soft',
  'color-paper-strong': 'color.paper-strong',
  'color-ink-soft':     'color.ink-soft',
  'color-ink-muted':    'color.ink-muted',
  'border':             'border.default',
  'border-strong':      'border.strong',
};

describe('CSS ↔ JSON color token parity', () => {
  for (const [cssVar, jsonPath] of Object.entries(COLOR_MAPPING)) {
    it(`--${cssVar} matches ${jsonPath}`, () => {
      const cssValue = resolveToken(cssVar, cssTokens).toLowerCase().replace(/\s+/g, '');
      const jsonNode = jsonTokens.get(jsonPath);
      expect(jsonNode, `JSON path ${jsonPath}`).toBeDefined();
      const jsonValue = String(jsonNode!.$value).toLowerCase().replace(/\s+/g, '');
      expect(cssValue).toBe(jsonValue);
    });
  }
});
