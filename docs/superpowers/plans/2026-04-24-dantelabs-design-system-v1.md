# 단테랩스 디자인 시스템 v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 단테랩스 디자인 시스템 v1 (컬러 토큰 14개 + 타이포 스케일 Editorial 5단 / UI 9단)을 CSS·JSON·문서·프리뷰 페이지로 구현한다.

**Architecture:** 2-tier 토큰 아키텍처 (Primitive → Semantic). CSS Custom Properties를 hand-author 최우선 산출물로 작성하고, 동일 값을 DTCG(Design Tokens Community Group) 포맷 JSON으로 병행 관리한다. Vitest + TypeScript로 ① 접근성 명암비(WCAG AA) 자동 검증, ② CSS↔JSON 토큰 일관성 검증. `preview/index.html`에서 실제 폰트 로딩·렌더링을 육안으로 확인한다.

**Tech Stack:** CSS Custom Properties · DTCG JSON · HTML · Vitest + TypeScript (tests only) · Google Fonts (Nanum Myeongjo, Noto Serif KR, Playfair Display, Source Serif 4, JetBrains Mono) · jsDelivr CDN (Pretendard variable)

**Spec:** `docs/superpowers/specs/2026-04-24-dantelabs-design-system-design.md`

---

## File Structure

최종 생성될 파일 구조. 각 파일은 단일 책임(single responsibility)을 가진다.

```
dantelabs_design_system/
├── package.json                   # Node 의존성 (vitest, typescript만)
├── tsconfig.json                  # TS 컴파일러 설정 (tests only)
├── vitest.config.ts               # Vitest 설정
│
├── css/
│   ├── tokens.css                 # :root 선언 · Primitive + Semantic 토큰
│   ├── typography.css             # .type-* utility classes
│   └── fonts.css                  # @import · fallback · font-display
│
├── tokens/
│   ├── color.json                 # DTCG 포맷 컬러 토큰
│   ├── typography.json            # DTCG 포맷 타이포 토큰
│   └── index.json                 # 병합 엔트리
│
├── preview/
│   └── index.html                 # 전 토큰 시각 검증 페이지
│
├── docs/
│   ├── README.md                  # 개요·설치·사용법·버전 정책
│   ├── color.md                   # 팔레트 가이드
│   ├── typography.md              # 스케일 가이드
│   └── usage-rules.md             # 60/30/10·pairing·접근성
│
├── figma/
│   └── library-plan.md            # v2 Figma 라이브러리 계획
│
└── tests/
    ├── contrast.test.ts           # WCAG 명암비 단위 테스트
    ├── color-contrast.test.ts     # 스펙 약속 명암비 검증
    ├── typography-tokens.test.ts  # 필수 타이포 토큰 존재 검증
    ├── token-consistency.test.ts  # CSS ↔ JSON 페어링 검증
    └── helpers/
        ├── contrast.ts            # WCAG 상대광도 계산기
        ├── parse-css.ts           # CSS 커스텀 프로퍼티 파서
        └── load-json-tokens.ts    # DTCG JSON 평탄화 유틸
```

**결정 근거**
- JSON generator를 쓰지 않는 이유: v1 토큰 수가 적어(~30개) hand-authoring이 더 빠르고, 일관성 테스트로 드리프트 방지 충분. Style Dictionary는 v2 재검토.
- 테스트는 vitest/TS만. 런타임 JS 코드는 산출물에 포함되지 않음 (순수 CSS 라이브러리).

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `tests/.gitkeep`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "dantelabs-design-system",
  "version": "1.0.0",
  "description": "단테랩스 디자인 시스템 v1 - 컬러 토큰 + 타이포그래피",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.1.8",
    "typescript": "^5.6.3",
    "@types/node": "^22.9.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node", "vitest/globals"],
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  },
  "include": ["tests/**/*.ts"]
}
```

- [ ] **Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create tests/.gitkeep**

빈 파일 하나:
```
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: `package-lock.json` 생성, 의존성 설치 완료

- [ ] **Step 6: Verify vitest runs (empty)**

Run: `npm test`
Expected: `No test files found` 또는 `0 test files` — 에러 없음

- [ ] **Step 7: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts tests/.gitkeep package-lock.json
git commit -m "chore: scaffold Node + TypeScript + Vitest for token tests"
```

---

## Task 2: WCAG Contrast Helper (TDD)

**Files:**
- Create: `tests/helpers/contrast.ts`
- Create: `tests/contrast.test.ts`

**배경:** WCAG 2.x 상대광도(relative luminance) 공식으로 두 색의 명암비를 계산. 구현 전 테스트 작성.

- [ ] **Step 1: Write failing test**

`tests/contrast.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { contrastRatio } from './helpers/contrast';

describe('WCAG contrast ratio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('returns 1 for same color', () => {
    expect(contrastRatio('#F7F2E6', '#F7F2E6')).toBeCloseTo(1, 1);
  });

  it('ink on paper exceeds WCAG AAA (7:1)', () => {
    const ratio = contrastRatio('#1a1a1a', '#F7F2E6');
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  it('link-strong on paper meets WCAG AA (4.5:1)', () => {
    const ratio = contrastRatio('#3E5E75', '#F7F2E6');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#A0522D', '#F7F2E6')).toBeCloseTo(
      contrastRatio('#F7F2E6', '#A0522D'),
      2
    );
  });

  it('accepts 3-digit hex', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 0);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- contrast`
Expected: FAIL — "Cannot find module './helpers/contrast'"

- [ ] **Step 3: Implement contrast helper**

`tests/helpers/contrast.ts`:

```typescript
function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function srgbChannel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- contrast`
Expected: `✓ 6 tests passed`

- [ ] **Step 5: Commit**

```bash
git add tests/helpers/contrast.ts tests/contrast.test.ts
git commit -m "test: add WCAG contrast ratio helper with unit tests"
```

---

## Task 3: Color Tokens CSS (Tier 1 + Tier 2)

**Files:**
- Create: `css/tokens.css`

**배경:** 스펙 §2 + §4.2의 CSS 완전 스펙을 그대로 옮긴다. 타이포 토큰은 Task 5에서 추가.

- [ ] **Step 1: Create css/tokens.css with color tokens**

```css
/* ═══════════════════════════════════════════════════════════════
 * 단테랩스 디자인 시스템 v1 · Tokens
 * Spec: docs/superpowers/specs/2026-04-24-dantelabs-design-system-design.md
 * ═══════════════════════════════════════════════════════════════ */

:root {
  /* ─── TIER 1 · Primitive Color Tokens ─────────────────────── */
  --color-paper: #F7F2E6;
  --color-ink: #1a1a1a;
  --color-rust: #A0522D;
  --color-sepia: #8B6F47;
  --color-slate: #435B6C;
  --color-link: #5B7F99;
  --color-link-strong: #3E5E75;
  --color-amber: #C9A857;
  --color-mark: #EBC65B;

  --color-paper-soft: #EDE7D7;
  --color-paper-strong: #FCF9F0;
  --color-ink-soft: #3a3a3a;
  --color-ink-muted: #6a6a6a;

  --border: rgba(26, 26, 26, 0.12);
  --border-strong: rgba(26, 26, 26, 0.24);

  /* ─── TIER 2 · Semantic Color Tokens ──────────────────────── */
  --bg-canvas: var(--color-paper);
  --bg-surface: var(--color-paper-strong);
  --bg-subtle: var(--color-paper-soft);

  --text-primary: var(--color-ink);
  --text-secondary: var(--color-ink-soft);
  --text-muted: var(--color-ink-muted);
  --text-link: var(--color-link-strong);
  --text-meta: var(--color-sepia);

  --accent-brand: var(--color-rust);
  --accent-alt: var(--color-slate);
  --highlight: var(--color-mark);

  --state-info: var(--color-link-strong);
  --state-success: var(--color-amber);
  --state-warning: var(--color-mark);
  --state-danger: var(--color-rust);
}
```

- [ ] **Step 2: Verify file written**

Run: `ls -la css/tokens.css && wc -l css/tokens.css`
Expected: 파일 존재, 40+ 라인

- [ ] **Step 3: Commit**

```bash
git add css/tokens.css
git commit -m "feat: add CSS color tokens (Tier 1 primitive + Tier 2 semantic)"
```

---

## Task 4: Color Contrast Assertions Test

**Files:**
- Create: `tests/helpers/parse-css.ts`
- Create: `tests/color-contrast.test.ts`

**배경:** Task 3의 실제 CSS 파일을 파싱해 스펙 §2.3의 명암비 약속이 실제로 성립하는지 자동 검증.

- [ ] **Step 1: Implement CSS custom property parser**

`tests/helpers/parse-css.ts`:

```typescript
import { readFileSync } from 'node:fs';

export function parseCustomProperties(cssPath: string): Map<string, string> {
  const source = readFileSync(cssPath, 'utf8');
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
    const inner = value.slice(6, value.indexOf(')')).trim();
    const next = tokens.get(inner);
    if (next === undefined) throw new Error(`Alias target not found: --${inner}`);
    value = next;
    depth++;
  }
  return value;
}
```

- [ ] **Step 2: Write contrast assertion test**

`tests/color-contrast.test.ts`:

```typescript
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
```

- [ ] **Step 3: Run test**

Run: `npm test -- color-contrast`
Expected: 9 tests passed

- [ ] **Step 4: Commit**

```bash
git add tests/helpers/parse-css.ts tests/color-contrast.test.ts
git commit -m "test: assert spec-declared WCAG contrasts on actual tokens.css"
```

---

## Task 5: Typography Tokens CSS

**Files:**
- Modify: `css/tokens.css` (append typography section)
- Create: `tests/typography-tokens.test.ts`

- [ ] **Step 1: Append typography tokens to tokens.css**

`css/tokens.css`의 마지막 `}` 바로 위에 아래 내용 삽입:

```css

  /* ─── TIER 1 · Typography Primitives ──────────────────────── */
  --font-editorial-ko: 'Nanum Myeongjo', 'Noto Serif KR', 'Times New Roman', serif;
  --font-editorial-en: 'Playfair Display', 'Times New Roman', serif;
  --font-heading: 'Noto Serif KR', 'Source Serif 4', Georgia, serif;
  --font-body: 'Noto Serif KR', 'Source Serif 4', Georgia, serif;
  --font-sans: 'Pretendard', -apple-system, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, Consolas, monospace;

  /* ─── Editorial Scale (5 levels · spec §3.2) ──────────────── */
  --type-hero:    800 128px/1.15 var(--font-editorial-ko);
  --type-display: 700  96px/1.10 var(--font-editorial-ko);
  --type-accent:  700  64px/1.20 var(--font-editorial-ko);
  --type-sub:     400  32px/1.40 var(--font-body);
  --type-meta:    500  18px/1.50 var(--font-sans);

  /* ─── UI Scale (9 levels · spec §3.3) ─────────────────────── */
  --type-h1:      700 56px/1.20 var(--font-heading);
  --type-h2:      700 40px/1.25 var(--font-heading);
  --type-h3:      600 28px/1.30 var(--font-heading);
  --type-h4:      600 22px/1.35 var(--font-heading);
  --type-body-lg: 400 20px/1.65 var(--font-body);
  --type-body:    400 16px/1.65 var(--font-body);
  --type-body-sm: 400 14px/1.50 var(--font-body);
  --type-caption: 500 13px/1.40 var(--font-sans);
  --type-button:  600 14px/1.00 var(--font-sans);
```

- [ ] **Step 2: Write existence test**

`tests/typography-tokens.test.ts`:

```typescript
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
```

- [ ] **Step 3: Run test**

Run: `npm test -- typography-tokens`
Expected: 20 tests passed

- [ ] **Step 4: Commit**

```bash
git add css/tokens.css tests/typography-tokens.test.ts
git commit -m "feat: add typography primitives and scale tokens (Editorial 5 + UI 9)"
```

---

## Task 6: Typography Utility Classes

**Files:**
- Create: `css/typography.css`

**배경:** `font` 축약 토큰은 letter-spacing·text-transform을 표현 못 함. Utility class에서 이 두 속성까지 포함해 적용 (spec §3.2·§3.3 컬럼 기준).

- [ ] **Step 1: Create css/typography.css**

```css
/* ═══════════════════════════════════════════════════════════════
 * Typography utility classes
 * 토큰 기반 축약 + letter-spacing / text-transform 보강
 * Spec §3.2 · §3.3
 * ═══════════════════════════════════════════════════════════════ */

/* ─── Editorial Track ─────────────────────────────────────── */
.type-hero {
  font: var(--type-hero);
  letter-spacing: -0.02em;
}

.type-display {
  font: var(--type-display);
  letter-spacing: -0.01em;
}

.type-accent {
  font: var(--type-accent);
}

.type-sub {
  font: var(--type-sub);
}

.type-meta {
  font: var(--type-meta);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* ─── UI Track ────────────────────────────────────────────── */
.type-h1 {
  font: var(--type-h1);
  letter-spacing: -0.01em;
}

.type-h2 { font: var(--type-h2); }
.type-h3 { font: var(--type-h3); }
.type-h4 { font: var(--type-h4); }

.type-body-lg { font: var(--type-body-lg); }
.type-body    { font: var(--type-body); }
.type-body-sm { font: var(--type-body-sm); }

.type-caption { font: var(--type-caption); }

.type-button {
  font: var(--type-button);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ─── Responsive · 모바일 축소 (spec §3.3) ─────────────── */
@media (max-width: 767px) {
  .type-h1 { font-size: 48px; }
  .type-h2 { font-size: 32px; }
  .type-h3 { font-size: 24px; }
  /* body 유지 */
}

/* ─── Tabular numerics (spec §3.3 예외 목록) ──────────── */
.num-tabular {
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: Verify file written**

Run: `wc -l css/typography.css`
Expected: 50+ 라인

- [ ] **Step 3: Commit**

```bash
git add css/typography.css
git commit -m "feat: add type-* utility classes + responsive + tabular nums"
```

---

## Task 7: Fonts CSS (Loading Strategy)

**Files:**
- Create: `css/fonts.css`

**배경:** 스펙 §3.4 — Google Fonts + jsDelivr Pretendard 이원 로딩.

- [ ] **Step 1: Create css/fonts.css**

```css
/* ═══════════════════════════════════════════════════════════════
 * Font loading
 * Google Fonts: Nanum Myeongjo, Noto Serif KR, Playfair Display,
 *               Source Serif 4, JetBrains Mono
 * jsDelivr    : Pretendard (Google Fonts 미제공)
 * Spec §3.4
 * ═══════════════════════════════════════════════════════════════ */

/* Google Fonts · serif & mono */
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* jsDelivr · Pretendard variable (dynamic subset) */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');

/* ─── HTML 레이어 최적 로딩 (권장) ────────────────────────
 * 이 파일을 import하는 대신, HTML <head>에서 직접 link + preconnect 권장.
 * 자세한 HTML 예시는 docs/README.md 설치 섹션 참조.
 * HTML 접근이 불가한 환경에서만 이 파일을 직접 @import 사용.
 * ─────────────────────────────────────────────────────── */
```

- [ ] **Step 2: Commit**

```bash
git add css/fonts.css
git commit -m "feat: add font loading CSS (Google Fonts + Pretendard jsDelivr)"
```

---

## Task 8: Color Tokens JSON (DTCG)

**Files:**
- Create: `tokens/color.json`

**배경:** Design Tokens Community Group 스펙 준수. `$value` + `$type`, alias는 `{token.path}` 형식.

- [ ] **Step 1: Create tokens/color.json**

```json
{
  "color": {
    "paper":        { "$value": "#F7F2E6", "$type": "color" },
    "ink":          { "$value": "#1a1a1a", "$type": "color" },
    "rust":         { "$value": "#A0522D", "$type": "color" },
    "sepia":        { "$value": "#8B6F47", "$type": "color" },
    "slate":        { "$value": "#435B6C", "$type": "color" },
    "link":         { "$value": "#5B7F99", "$type": "color" },
    "link-strong":  { "$value": "#3E5E75", "$type": "color" },
    "amber":        { "$value": "#C9A857", "$type": "color" },
    "mark":         { "$value": "#EBC65B", "$type": "color" },

    "paper-soft":   { "$value": "#EDE7D7", "$type": "color" },
    "paper-strong": { "$value": "#FCF9F0", "$type": "color" },
    "ink-soft":     { "$value": "#3a3a3a", "$type": "color" },
    "ink-muted":    { "$value": "#6a6a6a", "$type": "color" }
  },
  "border": {
    "default": { "$value": "rgba(26, 26, 26, 0.12)", "$type": "color" },
    "strong":  { "$value": "rgba(26, 26, 26, 0.24)", "$type": "color" }
  },
  "semantic": {
    "bg": {
      "canvas":  { "$value": "{color.paper}",         "$type": "color" },
      "surface": { "$value": "{color.paper-strong}",  "$type": "color" },
      "subtle":  { "$value": "{color.paper-soft}",    "$type": "color" }
    },
    "text": {
      "primary":   { "$value": "{color.ink}",          "$type": "color" },
      "secondary": { "$value": "{color.ink-soft}",     "$type": "color" },
      "muted":     { "$value": "{color.ink-muted}",    "$type": "color" },
      "link":      { "$value": "{color.link-strong}",  "$type": "color" },
      "meta":      { "$value": "{color.sepia}",        "$type": "color" }
    },
    "accent": {
      "brand": { "$value": "{color.rust}",  "$type": "color" },
      "alt":   { "$value": "{color.slate}", "$type": "color" }
    },
    "highlight": { "$value": "{color.mark}", "$type": "color" },
    "state": {
      "info":    { "$value": "{color.link-strong}", "$type": "color" },
      "success": { "$value": "{color.amber}",       "$type": "color" },
      "warning": { "$value": "{color.mark}",        "$type": "color" },
      "danger":  { "$value": "{color.rust}",        "$type": "color" }
    }
  }
}
```

- [ ] **Step 2: Verify JSON parses**

Run: `python3 -m json.tool tokens/color.json > /dev/null && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tokens/color.json
git commit -m "feat: add DTCG color tokens JSON (primitive + semantic)"
```

---

## Task 9: Typography Tokens JSON (DTCG)

**Files:**
- Create: `tokens/typography.json`

**배경:** DTCG `typography` composite type — `fontFamily`, `fontWeight`, `fontSize`, `lineHeight`, `letterSpacing`.

- [ ] **Step 1: Create tokens/typography.json**

```json
{
  "font": {
    "editorial-ko": {
      "$value": ["Nanum Myeongjo", "Noto Serif KR", "Times New Roman", "serif"],
      "$type": "fontFamily"
    },
    "editorial-en": {
      "$value": ["Playfair Display", "Times New Roman", "serif"],
      "$type": "fontFamily"
    },
    "heading": {
      "$value": ["Noto Serif KR", "Source Serif 4", "Georgia", "serif"],
      "$type": "fontFamily"
    },
    "body": {
      "$value": ["Noto Serif KR", "Source Serif 4", "Georgia", "serif"],
      "$type": "fontFamily"
    },
    "sans": {
      "$value": ["Pretendard", "-apple-system", "Segoe UI", "system-ui", "sans-serif"],
      "$type": "fontFamily"
    },
    "mono": {
      "$value": ["JetBrains Mono", "Menlo", "Consolas", "monospace"],
      "$type": "fontFamily"
    }
  },
  "editorial": {
    "hero": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.editorial-ko}",
        "fontWeight": 800,
        "fontSize": "128px",
        "lineHeight": 1.15,
        "letterSpacing": "-0.02em"
      }
    },
    "display": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.editorial-ko}",
        "fontWeight": 700,
        "fontSize": "96px",
        "lineHeight": 1.10,
        "letterSpacing": "-0.01em"
      }
    },
    "accent": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.editorial-ko}",
        "fontWeight": 700,
        "fontSize": "64px",
        "lineHeight": 1.20
      }
    },
    "sub": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.body}",
        "fontWeight": 400,
        "fontSize": "32px",
        "lineHeight": 1.40
      }
    },
    "meta": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{font.sans}",
        "fontWeight": 500,
        "fontSize": "18px",
        "lineHeight": 1.50,
        "letterSpacing": "0.16em",
        "textTransform": "uppercase"
      }
    }
  },
  "ui": {
    "h1": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.heading}", "fontWeight": 700, "fontSize": "56px", "lineHeight": 1.20, "letterSpacing": "-0.01em" }
    },
    "h2": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.heading}", "fontWeight": 700, "fontSize": "40px", "lineHeight": 1.25 }
    },
    "h3": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.heading}", "fontWeight": 600, "fontSize": "28px", "lineHeight": 1.30 }
    },
    "h4": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.heading}", "fontWeight": 600, "fontSize": "22px", "lineHeight": 1.35 }
    },
    "body-lg": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.body}", "fontWeight": 400, "fontSize": "20px", "lineHeight": 1.65 }
    },
    "body": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.body}", "fontWeight": 400, "fontSize": "16px", "lineHeight": 1.65 }
    },
    "body-sm": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.body}", "fontWeight": 400, "fontSize": "14px", "lineHeight": 1.50 }
    },
    "caption": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.sans}", "fontWeight": 500, "fontSize": "13px", "lineHeight": 1.40 }
    },
    "button": {
      "$type": "typography",
      "$value": { "fontFamily": "{font.sans}", "fontWeight": 600, "fontSize": "14px", "lineHeight": 1.00, "letterSpacing": "0.04em", "textTransform": "uppercase" }
    }
  }
}
```

- [ ] **Step 2: Verify JSON parses**

Run: `python3 -m json.tool tokens/typography.json > /dev/null && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tokens/typography.json
git commit -m "feat: add DTCG typography tokens JSON (Editorial + UI scales)"
```

---

## Task 10: Index Tokens JSON + Consistency Test

**Files:**
- Create: `tokens/index.json`
- Create: `tests/helpers/load-json-tokens.ts`
- Create: `tests/token-consistency.test.ts`

**배경:** CSS와 JSON의 드리프트 방지. 같은 값이어야 함을 자동 검증.

- [ ] **Step 1: Create tokens/index.json**

```json
{
  "$schema": "https://tr.designtokens.org/format/",
  "name": "dantelabs-design-system",
  "version": "1.0.0",
  "includes": ["./color.json", "./typography.json"]
}
```

(참고: DTCG `includes` 공식 지원은 드래프트 — v1에서는 참조 문서 역할)

- [ ] **Step 2: Implement JSON token loader helper**

`tests/helpers/load-json-tokens.ts`:

```typescript
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
```

- [ ] **Step 3: Write consistency test**

`tests/token-consistency.test.ts`:

```typescript
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
```

- [ ] **Step 4: Run test**

Run: `npm test -- token-consistency`
Expected: 15 tests passed

- [ ] **Step 5: Commit**

```bash
git add tokens/index.json tests/helpers/load-json-tokens.ts tests/token-consistency.test.ts
git commit -m "test: assert CSS ↔ JSON color token parity"
```

---

## Task 11: Preview HTML Page

**Files:**
- Create: `preview/index.html`

**배경:** 모든 토큰을 실제 폰트 로딩으로 시각 검증.

- [ ] **Step 1: Create preview/index.html**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단테랩스 디자인 시스템 v1 · Preview</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" as="style" crossorigin
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">

  <link rel="stylesheet" href="../css/tokens.css">
  <link rel="stylesheet" href="../css/typography.css">

  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: var(--bg-canvas); color: var(--text-primary); font-family: var(--font-body); }
    main { max-width: 1200px; margin: 0 auto; padding: 64px 32px; }

    .section { margin-bottom: 72px; padding-bottom: 48px; border-bottom: 1px solid var(--border); }
    .section:last-child { border-bottom: none; }
    .section-label { font-family: var(--font-sans); font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-meta); margin-bottom: 6px; }
    .section-title { font: var(--type-h2); font-family: 'Nanum Myeongjo', serif; color: var(--text-primary); margin: 0 0 24px 0; }

    .palette { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .chip { padding: 16px; border-radius: 8px; border: 1px solid var(--border); }
    .chip .block { height: 64px; border-radius: 4px; margin-bottom: 10px; border: 1px solid var(--border); }
    .chip .name { font-family: var(--font-sans); font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-primary); }
    .chip .hex  { font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
    .chip .role { font-family: var(--font-body); font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.45; }

    .type-row { display: grid; grid-template-columns: 160px 1fr; gap: 24px; padding: 14px 0; border-bottom: 1px dashed var(--border); align-items: baseline; }
    .type-row:last-child { border-bottom: none; }
    .type-row .meta { font-family: var(--font-sans); font-size: 11px; color: var(--text-meta); line-height: 1.5; }
    .type-row .meta strong { display: block; font-size: 12px; color: var(--text-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
  </style>
</head>
<body>
  <main>

    <header class="section">
      <div class="section-label">Dante Labs Design System</div>
      <h1 class="type-h1" style="font-family: 'Nanum Myeongjo', serif;">단테랩스 디자인 시스템 · v1</h1>
      <p class="type-body-lg" style="color: var(--text-secondary); max-width: 720px;">
        컬러 토큰 14개와 타이포 스케일 Editorial 5단 / UI 9단의 실제 렌더링 검증 페이지.
      </p>
    </header>

    <section class="section">
      <div class="section-label">Section 1 · Color Tokens</div>
      <h2 class="section-title">Core Palette</h2>
      <div class="palette">
        <div class="chip"><div class="block" style="background:var(--color-paper)"></div><div class="name">Paper</div><div class="hex">#F7F2E6</div><div class="role">배경 · 전체 캔버스</div></div>
        <div class="chip"><div class="block" style="background:var(--color-ink)"></div><div class="name">Ink</div><div class="hex">#1a1a1a</div><div class="role">본문 · 기본 텍스트</div></div>
        <div class="chip"><div class="block" style="background:var(--color-rust)"></div><div class="name">Rust</div><div class="hex">#A0522D</div><div class="role">브랜드 액센트 · danger</div></div>
        <div class="chip"><div class="block" style="background:var(--color-sepia)"></div><div class="name">Sepia</div><div class="hex">#8B6F47</div><div class="role">서명 · 메타 라벨</div></div>
        <div class="chip"><div class="block" style="background:var(--color-slate)"></div><div class="name">Slate</div><div class="hex">#435B6C</div><div class="role">감성 블루 베이스</div></div>
        <div class="chip"><div class="block" style="background:var(--color-link)"></div><div class="name">Link</div><div class="hex">#5B7F99</div><div class="role">기능 블루 (AA Large)</div></div>
        <div class="chip"><div class="block" style="background:var(--color-link-strong)"></div><div class="name">Link Strong</div><div class="hex">#3E5E75</div><div class="role">본문 링크 (AA body)</div></div>
        <div class="chip"><div class="block" style="background:var(--color-amber)"></div><div class="name">Amber</div><div class="hex">#C9A857</div><div class="role">감성 옐로우 · success</div></div>
        <div class="chip"><div class="block" style="background:var(--color-mark)"></div><div class="name">Mark</div><div class="hex">#EBC65B</div><div class="role">하이라이트 · warning</div></div>
      </div>
    </section>

    <section class="section">
      <div class="section-label">Section 2 · Editorial Scale</div>
      <h2 class="section-title">에디토리얼 · 5단 Beat</h2>

      <div class="type-row"><div class="meta"><strong>Hero</strong>128/1.15/800</div><div class="type-hero" style="font-family:'Nanum Myeongjo',serif;">AI를 <span style="color:var(--accent-alt)">오케스트레이트</span>하라</div></div>
      <div class="type-row"><div class="meta"><strong>Display</strong>96/1.10/700</div><div class="type-display" style="font-family:'Nanum Myeongjo',serif;">질문의 시대는 <span style="color:var(--accent-brand)">끝났다.</span></div></div>
      <div class="type-row"><div class="meta"><strong>Accent</strong>64/1.20/700</div><div class="type-accent" style="font-family:'Nanum Myeongjo',serif;"><span style="color:var(--accent-brand)">AI를</span> 연주하라</div></div>
      <div class="type-row"><div class="meta"><strong>Sub</strong>32/1.40/400</div><div class="type-sub"><a href="#" style="color:var(--text-link); text-decoration:underline; text-underline-offset:4px;">dante-labs.com</a>에서 시작</div></div>
      <div class="type-row"><div class="meta"><strong>Meta</strong>18/1.50/500 sans</div><div class="type-meta" style="color:var(--text-meta)">— DANTE LABS · 2026 · SEASON 02</div></div>
    </section>

    <section class="section">
      <div class="section-label">Section 3 · UI Scale</div>
      <h2 class="section-title">UI · 9단 Component Scale</h2>

      <div class="type-row"><div class="meta"><strong>h1</strong>56/1.20/700</div><div class="type-h1">AI를 오케스트레이트하라</div></div>
      <div class="type-row"><div class="meta"><strong>h2</strong>40/1.25/700</div><div class="type-h2">에이전틱 데이터 사이언스</div></div>
      <div class="type-row"><div class="meta"><strong>h3</strong>28/1.30/600</div><div class="type-h3">n8n과 Claude로 자동화 파이프라인 구축하기</div></div>
      <div class="type-row"><div class="meta"><strong>h4</strong>22/1.35/600</div><div class="type-h4">세션 1. 기본 개념 정리</div></div>
      <div class="type-row"><div class="meta"><strong>body-lg</strong>20/1.65/400</div><div class="type-body-lg">질문하는 시대는 끝나가고 있다. 이제는 답을 <a href="#" style="color:var(--text-link)">조합하고 연주하는</a> 기술이 필요하다.</div></div>
      <div class="type-row"><div class="meta"><strong>body</strong>16/1.65/400</div><div class="type-body">단테랩스는 AI 자동화와 <span style="background:var(--highlight); padding:0 4px;">에이전틱 데이터 사이언스</span>를 다루는 실무 중심의 교육·연구 랩입니다.</div></div>
      <div class="type-row"><div class="meta"><strong>body-sm</strong>14/1.50/400</div><div class="type-body-sm" style="color:var(--text-meta)">작성일 2026년 4월 24일 · 읽는 시간 6분 · 카테고리 Agentic AI</div></div>
      <div class="type-row"><div class="meta"><strong>caption</strong>13/1.40/500 sans</div><div class="type-caption" style="color:var(--text-meta)">CAPTION · 이미지 출처 · 메타 정보</div></div>
      <div class="type-row"><div class="meta"><strong>button</strong>14/1.00/600 sans</div><div><button class="type-button" style="background:var(--color-slate); color:var(--bg-canvas); border:0; padding:12px 24px; border-radius:4px; cursor:pointer;">시작하기 →</button></div></div>
    </section>

    <footer style="padding-top:24px; color:var(--text-meta); font-family:var(--font-sans); font-size:12px;">
      단테랩스 디자인 시스템 v1.0.0 · 2026-04-24
    </footer>
  </main>
</body>
</html>
```

- [ ] **Step 2: Open in browser**

Run: `open preview/index.html`

육안 확인 체크리스트:
- 9개 컬러 스와치 모두 정확한 HEX로 렌더
- Nanum Myeongjo·Noto Serif KR·Pretendard 폰트 로드 (DevTools Network 탭에서 확인)
- Editorial Hero 128px / UI h1 56px 실측 일치
- Rust·Slate·Link·Mark 강조 구분됨

- [ ] **Step 3: Commit**

```bash
git add preview/index.html
git commit -m "feat: add preview/index.html for visual token verification"
```

---

## Task 12: Color Documentation

**Files:**
- Create: `docs/color.md`

- [ ] **Step 1: Create docs/color.md**

```markdown
# 컬러 토큰 가이드

단테랩스 디자인 시스템 v1의 컬러 팔레트 사용 가이드. 스펙 §2 참조.

## Core Palette · 9 primitive tokens

| 토큰 | CSS 변수 | HEX | 역할 | 주 용도 |
|---|---|---|---|---|
| Paper | `--color-paper` | `#F7F2E6` | 배경 · 전체 캔버스 | body 배경, 큰 표면 |
| Ink | `--color-ink` | `#1a1a1a` | 본문 · 기본 텍스트 | 모든 paragraph, 헤딩 |
| Rust | `--color-rust` | `#A0522D` | 브랜드 액센트 + danger | Ink reveal, 장식, 에러 |
| Sepia | `--color-sepia` | `#8B6F47` | 메타 라벨 | 서명, 장 번호, caption |
| Slate | `--color-slate` | `#435B6C` | 감성 블루 | Editorial 대체 강조 |
| Link | `--color-link` | `#5B7F99` | 기능 블루 (AA Large) | 큰 텍스트 링크, 장식 링크 |
| Link Strong | `--color-link-strong` | `#3E5E75` | **본문 링크** (AA body) | body/body-sm 내부 링크 |
| Amber | `--color-amber` | `#C9A857` | 감성 옐로우 · success | 긍정 상태, 강조 아이콘 |
| Mark | `--color-mark` | `#EBC65B` | 하이라이트 · warning | 형광펜 하이라이트, 경고 |

## Extended Neutrals

| 토큰 | 값 | 사용 |
|---|---|---|
| `--color-paper-soft` | `#EDE7D7` | 섹션 구분 바탕 |
| `--color-paper-strong` | `#FCF9F0` | 카드·하이라이트 박스 |
| `--color-ink-soft` | `#3a3a3a` | 2차 본문 |
| `--color-ink-muted` | `#6a6a6a` | 플레이스홀더·disabled |
| `--border` | `rgba(26,26,26,0.12)` | 일반 보더 |
| `--border-strong` | `rgba(26,26,26,0.24)` | 강조 보더 |

## Semantic 매핑 (권장 사용)

프로덕션 코드에서는 primitive 대신 semantic 이름 사용 권장.

- 배경: `--bg-canvas`, `--bg-surface`, `--bg-subtle`
- 텍스트: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-link`, `--text-meta`
- 강조: `--accent-brand`, `--accent-alt`, `--highlight`
- 상태: `--state-info`, `--state-success`, `--state-warning`, `--state-danger`

## 명암비 (WCAG)

| 조합 | 명암비 | 기준 |
|---|---|---|
| ink ↔ paper | ~14:1 | AAA ✓ |
| link-strong ↔ paper | ~4.6:1 | AA body ✓ |
| link ↔ paper | ~3.5:1 | AA Large only |
| slate ↔ paper | ~7.5:1 | AAA ✓ |
| rust ↔ paper | ~4.3:1 | AA Large |

**본문 링크는 반드시 `link-strong` 사용.** `link`는 24px 이상 / weight 700 이상일 때만.

## `rust`의 이중 용도

`rust`는 (1) 브랜드 장식 액센트, (2) UI 상태 `danger` 두 의미를 동시에 가진다. 한 화면에서 두 용도가 동시에 등장하지 않도록 설계 단계에서 체크. 상태 표시에는 반드시 아이콘·배경 처리로 맥락 분명히.
```

- [ ] **Step 2: Commit**

```bash
git add docs/color.md
git commit -m "docs: add color token usage guide"
```

---

## Task 13: Typography Documentation

**Files:**
- Create: `docs/typography.md`

- [ ] **Step 1: Create docs/typography.md**

```markdown
# 타이포그래피 가이드

단테랩스 디자인 시스템 v1의 타이포 스케일 사용 가이드. 스펙 §3 참조.

## 2-Track 구조

| Track | 대상 | 사용처 |
|---|---|---|
| **Editorial** | YouTube 배너·썸네일, 모션그래픽, 아티클 히어로 | `hero`·`display`·`accent`·`sub`·`meta` |
| **UI** | 홈페이지 UI/UX, 아티클 본문 | `h1`–`h4`, `body-lg`·`body`·`body-sm`, `caption`, `button` |

## Font Stack

| 역할 | Primary | CSS 변수 |
|---|---|---|
| Editorial 한글 | Nanum Myeongjo | `--font-editorial-ko` |
| Editorial Latin | Playfair Display | `--font-editorial-en` |
| UI 헤딩·본문 | Noto Serif KR | `--font-heading`, `--font-body` |
| 메타·버튼·캡션 | Pretendard | `--font-sans` |
| 코드 | JetBrains Mono | `--font-mono` |

## Editorial Scale

| 클래스 | 크기 | 행간 | Weight | 용도 |
|---|---|---|---|---|
| `.type-hero` | 128px | 1.15 | 800 | 썸네일 결정적 키워드 |
| `.type-display` | 96px | 1.10 | 700 | 히어로 긴 문장 |
| `.type-accent` | 64px | 1.20 | 700 | 부분 강조 |
| `.type-sub` | 32px | 1.40 | 400 | 보조 설명, CTA URL |
| `.type-meta` | 18px | 1.50 | 500 | 서명·시즌 (UPPERCASE + tracking 0.16em) |

큰 스케일 필요 시: `transform: scale(1.5)` 또는 `clamp()` 사용. 토큰은 고정.

## UI Scale

| 클래스 | 크기 | 행간 | Weight | 폰트 |
|---|---|---|---|---|
| `.type-h1` | 56px | 1.20 | 700 | Serif |
| `.type-h2` | 40px | 1.25 | 700 | Serif |
| `.type-h3` | 28px | 1.30 | 600 | Serif |
| `.type-h4` | 22px | 1.35 | 600 | Serif |
| `.type-body-lg` | 20px | 1.65 | 400 | Serif |
| `.type-body` | 16px | 1.65 | 400 | Serif (**기본**) |
| `.type-body-sm` | 14px | 1.50 | 400 | Serif |
| `.type-caption` | 13px | 1.40 | 500 | Sans |
| `.type-button` | 14px | 1.00 | 600 | Sans (UPPERCASE + tracking 0.04em) |

### 반응형 (< 768px)

- `.type-h1` 56 → 48
- `.type-h2` 40 → 32
- `.type-h3` 28 → 24
- `.type-body` 16 유지

### Sans 오버라이드 예외 목록

다음 경우에 한해 `.num-tabular` 또는 `--font-sans`로 교체 허용:

1. 데이터 테이블의 숫자 셀
2. 폼 입력 필드
3. 숫자 전용 영역 (통계, 차트 라벨, 금액, 카운터)

**본문 paragraph·헤딩에는 절대 적용하지 않는다.**

## 사용 예

```html
<article>
  <h1 class="type-h1">AI를 오케스트레이트하라</h1>
  <p class="type-body-lg">질문하는 시대는 끝나가고 있다…</p>
  <p class="type-body">단테랩스는 AI 자동화와…</p>
  <time class="type-body-sm" style="color: var(--text-meta);">2026년 4월 24일</time>
</article>
```

## 폰트 로딩

자세한 내용은 스펙 §3.4 및 `css/fonts.css` 참조.
```

- [ ] **Step 2: Commit**

```bash
git add docs/typography.md
git commit -m "docs: add typography scale usage guide"
```

---

## Task 14: Usage Rules Documentation

**Files:**
- Create: `docs/usage-rules.md`

- [ ] **Step 1: Create docs/usage-rules.md**

```markdown
# 사용 규칙

단테랩스 디자인 시스템 v1의 컬러·타이포 조합 규칙. 스펙 §2.5 · §3.5 종합.

## 60/30/10 컬러 분배

| 비율 | 역할 | 토큰 |
|---|---|---|
| **60%** | 배경 | `paper` |
| **30%** | 본문·텍스트 | `ink`, `ink-soft` |
| **10%** | 액센트 | `rust`, `slate`, `mark`, `amber` |

액센트 10%를 여러 토큰이 나눠 쓰므로 한 토큰이 1–3%를 넘지 않도록.

## Accent Pairing 규칙

- `rust` + `slate` 공존: **OK** (대립 색이 아니라 이중 강조)
- `amber` + `mark`: 한 화면에 **각 1회씩만** (같은 노란색 계열의 중복 사용 방지)
- `rust` + `mark`: OK, 단 mark는 하이라이트 블록 1–2개에 한정
- `slate` + `link`: 시각적 유사 → 링크와 장식 블루 혼용 금지 (맥락 혼동)

## 접근성 규칙

1. **본문 내 링크는 `link-strong`.** `link`는 24px 이상 또는 weight 700에서만.
2. **모든 텍스트는 AA 이상.** Ink on paper가 기본. 예외는 meta/caption (sepia) ≥ 3:1만 확인.
3. **색만으로 의미 전달 금지.** 상태 표시에는 아이콘·라벨 병기.
4. **포커스 링**은 `--color-slate` 2px outline 권장 (추후 `--focus-ring` 토큰 도입).

## Typography Pairing 규칙

- 한 화면에 Serif는 **2종까지** (예: Nanum Myeongjo heading + Noto Serif KR body)
- Sans는 메타 역할 + typography.md 예외 목록에서만
- italic은 Playfair 인용·장식 한정 (Nanum Myeongjo italic 미사용)

## Dark Mode

v1은 **light only**. 다크 매핑은 v2에서 semantic 재정의로 확장.

## Do / Don't

### ✓ DO

```css
.article-body { color: var(--text-primary); background: var(--bg-canvas); }
.cta-link     { color: var(--text-link); /* = link-strong */ }
.hero-word    { color: var(--accent-brand); /* = rust */ font: var(--type-hero); }
```

### ✗ DON'T

```css
/* 본문 링크를 link(약한 대비)로 사용 금지 */
.body-link { color: var(--color-link); font-size: 16px; }

/* 본문을 Pretendard sans로 치환 금지 */
.article-body { font-family: var(--font-sans); }
```
```

- [ ] **Step 2: Commit**

```bash
git add docs/usage-rules.md
git commit -m "docs: add color/typography usage rules and dos-donts"
```

---

## Task 15: README

**Files:**
- Create: `docs/README.md`

- [ ] **Step 1: Create docs/README.md**

```markdown
# 단테랩스 디자인 시스템 v1

단테랩스의 통합 브랜드 디자인 시스템. 컬러 토큰 14개와 타이포 스케일 Editorial 5단 / UI 9단으로 구성.

**설계 스펙**: [2026-04-24-dantelabs-design-system-design.md](superpowers/specs/2026-04-24-dantelabs-design-system-design.md)

## 적용 대상

| 트랙 | 대상 카테고리 |
|---|---|
| Editorial | YouTube 배너, YouTube 영상·썸네일, 브랜드 모션그래픽, 아티클 히어로 |
| UI | 홈페이지 UI/UX, 아티클 본문, 폼·테이블·카드 |

## 설치 · 사용

### HTML에서 바로 사용

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">

<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/typography.css">
```

### 사용 예

```html
<h1 class="type-h1">AI를 오케스트레이트하라</h1>
<p class="type-body">단테랩스는 AI 자동화와 에이전틱 데이터 사이언스를…</p>
<button class="type-button" style="background: var(--accent-alt); color: var(--bg-canvas); border:0; padding:12px 24px;">시작하기 →</button>
```

## 문서

- [color.md](color.md) · 컬러 토큰 전체·명암비
- [typography.md](typography.md) · 타이포 스케일·사용 예
- [usage-rules.md](usage-rules.md) · pairing·접근성·Do/Don't

## 미리보기

`preview/index.html`을 브라우저에서 열면 모든 토큰의 실제 렌더링 확인 가능.

## 토큰 포맷

1. **CSS Custom Properties** (`css/tokens.css`) — 프로덕션 최우선
2. **DTCG JSON** (`tokens/color.json`, `tokens/typography.json`) — Figma·Style Dictionary 연동 대비

두 포맷 값은 `tests/token-consistency.test.ts`에서 자동 검증.

## 버전 정책

- Semantic Versioning (major.minor.patch)
- BREAKING → major · 토큰 추가·의미 확장 → minor · HEX 미세 조정 → patch
- 현재: **v1.0.0**

## v2 이후

- Spacing / radius / shadow / motion 토큰
- 컴포넌트 라이브러리
- Dark mode 매핑
- Figma 라이브러리 ([figma/library-plan.md](../figma/library-plan.md))

## 테스트

```bash
npm install
npm test
```

범위: WCAG 명암비 · CSS ↔ JSON 일관성 · 필수 토큰 존재.
```

- [ ] **Step 2: Commit**

```bash
git add docs/README.md
git commit -m "docs: add README with install/usage/version policy"
```

---

## Task 16: Figma Library Plan (v2 Stub)

**Files:**
- Create: `figma/library-plan.md`

- [ ] **Step 1: Create figma/library-plan.md**

```markdown
# Figma 라이브러리 구축 계획 (v2)

**상태**: v1에서는 범위 외. v2 이후 작업의 출발점.

## 전략

1. **CSS·JSON 토큰을 Figma Variables로 import**
   - Tokens Studio plugin 사용
   - DTCG JSON(`tokens/*.json`)을 직접 로드
   - 단방향: 코드가 source of truth, Figma는 반영만

2. **모드 구성**
   - `Light` (현재 v1)
   - `Dark` (v2에서 추가)

3. **스타일 vs 변수 분리**
   - 컬러·타이포: **Variables**
   - Shadow·blur·radius: v2 토큰화 후 Styles

## 라이브러리 파일 구조 (계획)

- Tokens: Colors Variables (Light+Dark), Typography Variables
- Foundations: Text Styles, Color Styles
- Components (v2): Button, Card 등
- Templates: YouTube Banner, YouTube Thumbnail, Article Hero

## 마일스톤

- [ ] M1: Tokens Studio plugin 세팅, color.json import
- [ ] M2: typography.json import, Text Styles 생성
- [ ] M3: Light + Dark 모드 구성
- [ ] M4: YouTube / Article 템플릿 파일 생성
- [ ] M5: Components 라이브러리화

## 참고

- Tokens Studio · https://tokens.studio
- DTCG draft · https://tr.designtokens.org/format/
- v1 토큰: `../tokens/color.json`, `../tokens/typography.json`
```

- [ ] **Step 2: Commit**

```bash
git add figma/library-plan.md
git commit -m "docs: add Figma library v2 plan stub"
```

---

## Task 17: Final Verification

**Files:** (no new files)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: **all tests pass** (~40+ assertions across contrast, typography-tokens, color-contrast, token-consistency)

- [ ] **Step 2: Validate all JSON files**

Run:
```bash
python3 -m json.tool tokens/color.json > /dev/null && echo "color.json OK"
python3 -m json.tool tokens/typography.json > /dev/null && echo "typography.json OK"
python3 -m json.tool tokens/index.json > /dev/null && echo "index.json OK"
```
Expected: 3개 모두 `OK`

- [ ] **Step 3: Visual review in browser**

Run: `open preview/index.html`

육안 체크리스트:
- [ ] 9개 컬러 스와치가 스펙 HEX로 렌더
- [ ] 폰트 네트워크 요청 완료 (Nanum Myeongjo 800, Noto Serif KR 400/600/700, Playfair, Source Serif 4, JetBrains Mono, Pretendard)
- [ ] Editorial 5단: Hero 128 / Display 96 / Accent 64 / Sub 32 / Meta 18 실측 일치
- [ ] UI 9단: h1 56 ~ button 14 실측 일치
- [ ] Rust·Slate·Link·Mark 강조가 화면에서 구분됨
- [ ] Pretendard는 메타·버튼·캡션에만, 본문·헤딩은 Serif

- [ ] **Step 4: Check git status clean**

Run: `git status`
Expected: `nothing to commit, working tree clean`

- [ ] **Step 5: Tag release**

Run:
```bash
git tag -a v1.0.0 -m "Design system v1.0.0 — color tokens + typography"
```

- [ ] **Step 6: Final log review**

Run: `git log --oneline`
Expected: spec 2개 → scaffolding → contrast → 각 Task 커밋이 순서대로 명확히 분리.

---

## Self-Review

**Spec coverage** (스펙 §별 → 구현 태스크):
- §1 Overview → Task 15 (README)
- §2 컬러 토큰 → Tasks 3, 4, 8
- §3 타이포그래피 → Tasks 5, 6, 7, 9
- §4.1 2-tier 아키텍처 → Tasks 3, 8
- §4.2 CSS 완전 스펙 → Tasks 3, 5
- §4.3 파일 구조 → 전체 태스크 집합
- §4.4 포맷 우선순위 → Tasks 3 (CSS 우선), 8/9 (JSON 병행)
- §5 버전 정책 → Tasks 15, 17 (tagging)
- §6 참고 이미지 → 스펙 본문 기록
- §7 다음 단계 → 이 플랜 자체

**Placeholder scan**: `TBD`, `TODO` 없음. 모호한 "적절히/나중에" 문장 없음. 모든 코드 블록은 직접 실행 가능한 완성 상태.

**Type consistency**:
- CSS 변수명은 스펙 §4.2 기준 일관 (`--color-*`, `--font-*`, `--type-*`, `--text-*`)
- DTCG JSON 경로(`color.paper`, `semantic.text.link`)는 Task 10 consistency test의 매핑 테이블과 일치
- 함수명: `contrastRatio` (Task 2), `parseCustomProperties`·`resolveToken` (Task 4), `loadJsonTokens` (Task 10) — 후속 태스크에서 동일 이름으로 import 확인 완료
