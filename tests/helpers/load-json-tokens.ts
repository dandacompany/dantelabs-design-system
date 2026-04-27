import { readFileSync } from 'node:fs';

type TokenValue = string | number | string[] | Record<string, unknown>;
interface TokenNode {
  $value?: TokenValue;
  $type?: string;
  [key: string]: unknown;
}

export function loadJsonTokens(path: string): Map<string, TokenNode> {
  const tree = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
  const flat = new Map<string, TokenNode>();
  function walk(node: unknown, prefix: string[]): void {
    if (node === null || typeof node !== 'object') return;
    const n = node as Record<string, unknown>;
    if ('$value' in n) {
      flat.set(prefix.join('.'), n as TokenNode);
      return;
    }
    for (const [key, child] of Object.entries(n)) {
      walk(child, [...prefix, key]);
    }
  }
  walk(tree, []);
  return flat;
}
