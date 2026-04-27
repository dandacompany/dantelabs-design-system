import { readFileSync } from 'node:fs';

export function parseCustomProperties(cssPath: string): Map<string, string> {
  const source = readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
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
