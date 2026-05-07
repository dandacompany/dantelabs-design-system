import { readFileSync } from 'node:fs';

function stripBalancedAtRules(source: string, atRulePrefix: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const idx = source.indexOf(atRulePrefix, i);
    if (idx === -1) { out += source.slice(i); break; }
    out += source.slice(i, idx);
    // find opening brace
    const braceStart = source.indexOf('{', idx);
    if (braceStart === -1) { out += source.slice(idx); break; }
    let depth = 1;
    let j = braceStart + 1;
    while (j < source.length && depth > 0) {
      if (source[j] === '{') depth++;
      else if (source[j] === '}') depth--;
      j++;
    }
    i = j;
  }
  return out;
}

export function parseCustomProperties(cssPath: string): Map<string, string> {
  let source = readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Strip @media blocks so conditional overrides (e.g. prefers-reduced-motion)
  // don't clobber the base :root values during flat parsing.
  source = stripBalancedAtRules(source, '@media');
  const tokens = new Map<string, string>();
  const declRegex = /--([a-z0-9][a-z0-9-]*)\s*:\s*([^;]+);/gi;
  let match: RegExpExecArray | null;
  while ((match = declRegex.exec(source)) !== null) {
    tokens.set(match[1].trim(), match[2].trim());
  }
  return tokens;
}

export function resolveToken(
  name: string,
  tokens: Map<string, string>,
  maxDepth = 10,
): string {
  let value = tokens.get(name);
  if (value === undefined) throw new Error(`Token not found: --${name}`);
  let depth = 0;
  while (value.startsWith('var(--') && depth < maxDepth) {
    const inner = value.slice(6, value.indexOf(')')).split(',')[0].trim();
    const next = tokens.get(inner);
    if (next === undefined) throw new Error(`Alias target not found: --${inner}`);
    value = next;
    depth++;
  }
  return value;
}
