import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { parseCustomProperties } from './helpers/parse-css';

const tokens = parseCustomProperties(resolve(__dirname, '../css/tokens.css'));

describe('Typography tokens exist (spec §3.2 · §3.3)', () => {
  const editorial = ['hero', 'display', 'accent', 'sub', 'meta'];
  const ui = ['h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption', 'button'];
  const fonts = ['editorial-ko', 'editorial-en', 'heading', 'body', 'sans', 'mono'];

  it.each(editorial)('editorial: --type-%s defined', (name) => {
    expect(tokens.has(`type-${name}`)).toBe(true);
  });

  it.each(ui)('ui: --type-%s defined', (name) => {
    expect(tokens.has(`type-${name}`)).toBe(true);
  });

  it.each(fonts)('font stack: --font-%s defined', (name) => {
    expect(tokens.has(`font-${name}`)).toBe(true);
  });
});
