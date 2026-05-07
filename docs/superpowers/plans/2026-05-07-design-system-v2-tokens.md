# 단테랩스 디자인 시스템 v2 토큰 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** v1 디자인 시스템에 spacing·radius·shadow·motion 4개 토큰 패밀리를 추가해 v1.1.0으로 마이너 버전 업.

**Architecture:** 각 패밀리당 (1) DTCG JSON 토큰 파일, (2) CSS Custom Properties 블록, (3) vitest 일치 검증 테스트의 3-tier 구조. 기존 `tests/helpers/parse-css.ts` + `load-json-tokens.ts`를 그대로 재사용해 toCSSValue↔JSON 비교 패턴(현 `token-consistency.test.ts`)을 4번 반복.

**Tech Stack:** TypeScript 5.6, vitest 2.1, DTCG (W3C Design Tokens Community Group) JSON 포맷, CSS Custom Properties.

**Spec:** `docs/superpowers/specs/2026-05-07-design-system-v2-tokens-design.md`

---

## File Structure

| 파일                                                     | 작업   | 책임                                                          |
| -------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| `tokens/spacing.json`                                    | Create | 9스텝 + 5 alias spacing                                       |
| `tokens/radius.json`                                     | Create | 5개 radius                                                    |
| `tokens/shadow.json`                                     | Create | 5개 shadow (none + sm/md/lg/xl)                               |
| `tokens/motion.json`                                     | Create | 3 ease + 3 duration                                           |
| `tokens/index.json`                                      | Modify | `includes`에 4개 신규 파일 추가, version 1.1.0                |
| `css/tokens.css`                                         | Modify | spacing/radius/shadow/motion 블록 + reduce-motion media query |
| `tests/spacing-tokens.test.ts`                           | Create | DTCG ↔ CSS 일치 검증                                          |
| `tests/radius-tokens.test.ts`                            | Create | 동일 패턴                                                     |
| `tests/shadow-tokens.test.ts`                            | Create | 일치 + ink-tint 전용 검증 (rust/sepia hex 미포함)             |
| `tests/motion-tokens.test.ts`                            | Create | cubic-bezier 형식 + duration ms 단위 검증                     |
| `docs/spacing.md`, `radius.md`, `shadow.md`, `motion.md` | Create | 토큰 표 + 사용 규칙                                           |
| `docs/usage-rules.md`                                    | Modify | v2 토큰 페어링·금지 규칙 섹션 추가                            |
| `docs/README.md`                                         | Modify | v2 토큰 목록 갱신                                             |
| `preview/index.html`                                     | Modify | v2 토큰 시연 섹션 추가                                        |
| `CHANGELOG.md`                                           | Create | v1.0.0, v1.1.0 항목                                           |
| `package.json`                                           | Modify | version 1.0.0 → 1.1.0, description 갱신                       |

---

## Task 1: Spacing tokens

**Files:**

- Create: `tokens/spacing.json`
- Modify: `css/tokens.css` (append spacing block before existing closing `}`)
- Test: `tests/spacing-tokens.test.ts`

- [ ] **Step 1.1: Write failing test**

`tests/spacing-tokens.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { resolve } from "node:path";
import { parseCustomProperties, resolveToken } from "./helpers/parse-css";
import { loadJsonTokens } from "./helpers/load-json-tokens";

const CSS = resolve(__dirname, "../css/tokens.css");
const JSON_PATH = resolve(__dirname, "../tokens/spacing.json");

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
});

const NUMERIC_MAPPING: Record<string, string> = {
  "space-1": "space.1",
  "space-2": "space.2",
  "space-3": "space.3",
  "space-4": "space.4",
  "space-5": "space.5",
  "space-6": "space.6",
  "space-7": "space.7",
  "space-8": "space.8",
  "space-9": "space.9",
};

const ALIAS_MAPPING: Record<string, string> = {
  "space-xs": "space-1",
  "space-sm": "space-2",
  "space-md": "space-4",
  "space-lg": "space-6",
  "space-xl": "space-8",
};

describe("CSS ↔ JSON spacing token parity", () => {
  for (const [cssVar, jsonPath] of Object.entries(NUMERIC_MAPPING)) {
    it(`--${cssVar} matches ${jsonPath}`, () => {
      const cssValue = resolveToken(cssVar, cssTokens);
      const jsonNode = jsonTokens.get(jsonPath);
      expect(jsonNode, `JSON path ${jsonPath}`).toBeDefined();
      expect(cssValue).toBe(String(jsonNode!.$value));
    });
  }
});

describe("Spacing aliases resolve to numeric tokens", () => {
  for (const [aliasVar, targetVar] of Object.entries(ALIAS_MAPPING)) {
    it(`--${aliasVar} resolves to same value as --${targetVar}`, () => {
      expect(resolveToken(aliasVar, cssTokens)).toBe(
        resolveToken(targetVar, cssTokens),
      );
    });
  }
});
```

- [ ] **Step 1.2: Run test to verify it fails**

Run: `npm test -- spacing-tokens`
Expected: FAIL — `tokens/spacing.json` does not exist, `--space-1` not found in CSS.

- [ ] **Step 1.3: Create `tokens/spacing.json`**

```json
{
  "space": {
    "1": { "$value": "4px", "$type": "dimension" },
    "2": { "$value": "8px", "$type": "dimension" },
    "3": { "$value": "12px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" },
    "5": { "$value": "24px", "$type": "dimension" },
    "6": { "$value": "32px", "$type": "dimension" },
    "7": { "$value": "48px", "$type": "dimension" },
    "8": { "$value": "64px", "$type": "dimension" },
    "9": { "$value": "96px", "$type": "dimension" },
    "xs": { "$value": "{space.1}", "$type": "dimension" },
    "sm": { "$value": "{space.2}", "$type": "dimension" },
    "md": { "$value": "{space.4}", "$type": "dimension" },
    "lg": { "$value": "{space.6}", "$type": "dimension" },
    "xl": { "$value": "{space.8}", "$type": "dimension" }
  }
}
```

- [ ] **Step 1.4: Append spacing block to `css/tokens.css`**

Find the existing `:root { ... }` block (the last one if multiple). Inside it, after the existing tokens but before the closing `}`, append:

```css
/* ─── Spacing ─── */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
--space-xs: var(--space-1);
--space-sm: var(--space-2);
--space-md: var(--space-4);
--space-lg: var(--space-6);
--space-xl: var(--space-8);
```

- [ ] **Step 1.5: Run test to verify it passes**

Run: `npm test -- spacing-tokens`
Expected: PASS — all 14 tests (9 numeric + 5 alias).

- [ ] **Step 1.6: Commit**

```bash
git add tokens/spacing.json css/tokens.css tests/spacing-tokens.test.ts
git commit -m "feat(tokens): add v2 spacing scale (9 steps + 5 aliases)"
```

---

## Task 2: Radius tokens

**Files:**

- Create: `tokens/radius.json`
- Modify: `css/tokens.css` (append radius block)
- Test: `tests/radius-tokens.test.ts`

- [ ] **Step 2.1: Write failing test**

`tests/radius-tokens.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { resolve } from "node:path";
import { parseCustomProperties, resolveToken } from "./helpers/parse-css";
import { loadJsonTokens } from "./helpers/load-json-tokens";

const CSS = resolve(__dirname, "../css/tokens.css");
const JSON_PATH = resolve(__dirname, "../tokens/radius.json");

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
});

const RADIUS_MAPPING: Record<string, string> = {
  "radius-none": "radius.none",
  "radius-sm": "radius.sm",
  "radius-md": "radius.md",
  "radius-lg": "radius.lg",
  "radius-full": "radius.full",
};

describe("CSS ↔ JSON radius token parity", () => {
  for (const [cssVar, jsonPath] of Object.entries(RADIUS_MAPPING)) {
    it(`--${cssVar} matches ${jsonPath}`, () => {
      const cssValue = resolveToken(cssVar, cssTokens);
      const jsonNode = jsonTokens.get(jsonPath);
      expect(jsonNode, `JSON path ${jsonPath}`).toBeDefined();
      expect(cssValue).toBe(String(jsonNode!.$value));
    });
  }
});

describe("Radius scale invariants", () => {
  it("lg is the upper bound for non-pill shapes (8px)", () => {
    expect(resolveToken("radius-lg", cssTokens)).toBe("8px");
  });
  it("full is the explicit pill/circle exception", () => {
    expect(resolveToken("radius-full", cssTokens)).toBe("9999px");
  });
});
```

- [ ] **Step 2.2: Run test to verify it fails**

Run: `npm test -- radius-tokens`
Expected: FAIL — file/tokens missing.

- [ ] **Step 2.3: Create `tokens/radius.json`**

```json
{
  "radius": {
    "none": { "$value": "0", "$type": "dimension" },
    "sm": { "$value": "2px", "$type": "dimension" },
    "md": { "$value": "4px", "$type": "dimension" },
    "lg": { "$value": "8px", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  }
}
```

- [ ] **Step 2.4: Append radius block to `css/tokens.css`**

Inside the same `:root { ... }`, after the spacing block:

```css
/* ─── Radius ─── */
--radius-none: 0;
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
--radius-full: 9999px;
```

- [ ] **Step 2.5: Run test to verify it passes**

Run: `npm test -- radius-tokens`
Expected: PASS — 5 parity tests + 2 invariant tests.

- [ ] **Step 2.6: Commit**

```bash
git add tokens/radius.json css/tokens.css tests/radius-tokens.test.ts
git commit -m "feat(tokens): add v2 radius scale (none/sm/md/lg/full)"
```

---

## Task 3: Shadow tokens

**Files:**

- Create: `tokens/shadow.json`
- Modify: `css/tokens.css` (append shadow block)
- Test: `tests/shadow-tokens.test.ts`

DTCG `shadow` 타입은 배열이므로 `loadJsonTokens` flat Map의 `$value`가 array가 된다. CSS 문자열과 직접 비교 어려우므로 (1) 토큰 키 존재 여부와 (2) CSS 문자열의 ink-tint 전용 사용 검증으로 분리.

- [ ] **Step 3.1: Write failing test**

`tests/shadow-tokens.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { resolve } from "node:path";
import { parseCustomProperties, resolveToken } from "./helpers/parse-css";
import { loadJsonTokens } from "./helpers/load-json-tokens";

const CSS = resolve(__dirname, "../css/tokens.css");
const JSON_PATH = resolve(__dirname, "../tokens/shadow.json");

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
});

const SHADOW_KEYS = ["none", "sm", "md", "lg", "xl"] as const;

describe("Shadow tokens defined in both CSS and JSON", () => {
  for (const key of SHADOW_KEYS) {
    it(`--shadow-${key} exists in CSS`, () => {
      expect(cssTokens.has(`shadow-${key}`)).toBe(true);
    });
    it(`shadow.${key} exists in JSON`, () => {
      expect(jsonTokens.get(`shadow.${key}`)).toBeDefined();
    });
  }
});

describe("Shadow values use ink-tint only (no color shadows)", () => {
  const FORBIDDEN_HEX = [
    "#a0522d",
    "#8b6f47",
    "#435b6c",
    "#5b7f99",
    "#3e5e75",
    "#c9a857",
    "#ebc65b",
  ];
  for (const key of SHADOW_KEYS) {
    if (key === "none") continue;
    it(`--shadow-${key} contains no brand color hex`, () => {
      const value = resolveToken(`shadow-${key}`, cssTokens).toLowerCase();
      for (const hex of FORBIDDEN_HEX) {
        expect(value, `--shadow-${key} must not contain ${hex}`).not.toContain(
          hex,
        );
      }
    });
    it(`--shadow-${key} uses rgba(26,26,26,...) ink tint`, () => {
      const value = resolveToken(`shadow-${key}`, cssTokens);
      expect(value).toMatch(/rgba\(\s*26\s*,\s*26\s*,\s*26\s*,/);
    });
  }
});

describe("Shadow ramp opacity is monotonically increasing", () => {
  it("sm < md < lg < xl by drop-shadow alpha", () => {
    const extractLastAlpha = (s: string): number => {
      const matches = [
        ...s.matchAll(/rgba\(26\s*,\s*26\s*,\s*26\s*,\s*([\d.]+)\)/g),
      ];
      return parseFloat(matches[matches.length - 1][1]);
    };
    const sm = extractLastAlpha(resolveToken("shadow-sm", cssTokens));
    const md = extractLastAlpha(resolveToken("shadow-md", cssTokens));
    const lg = extractLastAlpha(resolveToken("shadow-lg", cssTokens));
    const xl = extractLastAlpha(resolveToken("shadow-xl", cssTokens));
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
  });
});
```

- [ ] **Step 3.2: Run test to verify it fails**

Run: `npm test -- shadow-tokens`
Expected: FAIL — file/tokens missing.

- [ ] **Step 3.3: Create `tokens/shadow.json`**

```json
{
  "shadow": {
    "none": { "$value": "none", "$type": "shadow" },
    "sm": {
      "$value": [
        {
          "color": "rgba(26,26,26,0.06)",
          "offsetX": "0",
          "offsetY": "0",
          "blur": "0",
          "spread": "1px"
        },
        {
          "color": "rgba(26,26,26,0.04)",
          "offsetX": "0",
          "offsetY": "1px",
          "blur": "2px",
          "spread": "0"
        }
      ],
      "$type": "shadow"
    },
    "md": {
      "$value": [
        {
          "color": "rgba(26,26,26,0.08)",
          "offsetX": "0",
          "offsetY": "0",
          "blur": "0",
          "spread": "1px"
        },
        {
          "color": "rgba(26,26,26,0.06)",
          "offsetX": "0",
          "offsetY": "3px",
          "blur": "6px",
          "spread": "0"
        }
      ],
      "$type": "shadow"
    },
    "lg": {
      "$value": [
        {
          "color": "rgba(26,26,26,0.10)",
          "offsetX": "0",
          "offsetY": "0",
          "blur": "0",
          "spread": "1px"
        },
        {
          "color": "rgba(26,26,26,0.08)",
          "offsetX": "0",
          "offsetY": "8px",
          "blur": "16px",
          "spread": "0"
        }
      ],
      "$type": "shadow"
    },
    "xl": {
      "$value": [
        {
          "color": "rgba(26,26,26,0.12)",
          "offsetX": "0",
          "offsetY": "0",
          "blur": "0",
          "spread": "1px"
        },
        {
          "color": "rgba(26,26,26,0.10)",
          "offsetX": "0",
          "offsetY": "16px",
          "blur": "32px",
          "spread": "0"
        }
      ],
      "$type": "shadow"
    }
  }
}
```

- [ ] **Step 3.4: Append shadow block to `css/tokens.css`**

```css
/* ─── Shadow (editorial emboss · ink-tint) ─── */
--shadow-none: none;
--shadow-sm: 0 0 0 1px rgba(26, 26, 26, 0.06), 0 1px 2px rgba(26, 26, 26, 0.04);
--shadow-md: 0 0 0 1px rgba(26, 26, 26, 0.08), 0 3px 6px rgba(26, 26, 26, 0.06);
--shadow-lg: 0 0 0 1px rgba(26, 26, 26, 0.1), 0 8px 16px rgba(26, 26, 26, 0.08);
--shadow-xl:
  0 0 0 1px rgba(26, 26, 26, 0.12), 0 16px 32px rgba(26, 26, 26, 0.1);
```

- [ ] **Step 3.5: Run test to verify it passes**

Run: `npm test -- shadow-tokens`
Expected: PASS — 10 existence tests + 8 ink-tint tests + 1 monotonic test.

- [ ] **Step 3.6: Commit**

```bash
git add tokens/shadow.json css/tokens.css tests/shadow-tokens.test.ts
git commit -m "feat(tokens): add v2 shadow ramp (editorial emboss, ink-tint)"
```

---

## Task 4: Motion tokens

**Files:**

- Create: `tokens/motion.json`
- Modify: `css/tokens.css` (append motion block + reduce-motion media query)
- Test: `tests/motion-tokens.test.ts`

- [ ] **Step 4.1: Write failing test**

`tests/motion-tokens.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { parseCustomProperties, resolveToken } from "./helpers/parse-css";
import { loadJsonTokens } from "./helpers/load-json-tokens";

const CSS = resolve(__dirname, "../css/tokens.css");
const JSON_PATH = resolve(__dirname, "../tokens/motion.json");

let cssTokens: Map<string, string>;
let jsonTokens: ReturnType<typeof loadJsonTokens>;
let cssRaw: string;

beforeAll(() => {
  cssTokens = parseCustomProperties(CSS);
  jsonTokens = loadJsonTokens(JSON_PATH);
  cssRaw = readFileSync(CSS, "utf8");
});

const EASE_KEYS = ["page", "ink", "fold"] as const;
const DURATION_KEYS = ["fast", "base", "slow"] as const;

describe("Easing tokens are valid cubic-bezier", () => {
  for (const key of EASE_KEYS) {
    it(`--ease-${key} is a valid cubic-bezier 4-tuple`, () => {
      const value = resolveToken(`ease-${key}`, cssTokens);
      const match = value.match(
        /^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/,
      );
      expect(match, `--ease-${key} value: ${value}`).not.toBeNull();
    });
    it(`ease.${key} JSON has cubicBezier $type`, () => {
      const node = jsonTokens.get(`ease.${key}`);
      expect(node).toBeDefined();
      expect(node!.$type).toBe("cubicBezier");
    });
  }
});

describe("Duration tokens are positive integer ms", () => {
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

describe("Duration ramp is monotonically increasing", () => {
  it("fast < base < slow", () => {
    const ms = (k: string) =>
      parseInt(resolveToken(`duration-${k}`, cssTokens).replace("ms", ""), 10);
    expect(ms("fast")).toBeLessThan(ms("base"));
    expect(ms("base")).toBeLessThan(ms("slow"));
  });
});

describe("prefers-reduced-motion override", () => {
  it("CSS contains @media (prefers-reduced-motion: reduce) with 0ms overrides", () => {
    expect(cssRaw).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    const reduceBlock = cssRaw.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\n\}/,
    );
    expect(reduceBlock, "reduce-motion block").not.toBeNull();
    expect(reduceBlock![0]).toMatch(/--duration-fast:\s*0ms/);
    expect(reduceBlock![0]).toMatch(/--duration-base:\s*0ms/);
    expect(reduceBlock![0]).toMatch(/--duration-slow:\s*0ms/);
  });
});
```

- [ ] **Step 4.2: Run test to verify it fails**

Run: `npm test -- motion-tokens`
Expected: FAIL — file/tokens missing.

- [ ] **Step 4.3: Create `tokens/motion.json`**

```json
{
  "ease": {
    "page": {
      "$value": "cubic-bezier(0.32, 0.72, 0, 1)",
      "$type": "cubicBezier"
    },
    "ink": {
      "$value": "cubic-bezier(0.16, 1, 0.3, 1)",
      "$type": "cubicBezier"
    },
    "fold": {
      "$value": "cubic-bezier(0.7, 0, 0.84, 0)",
      "$type": "cubicBezier"
    }
  },
  "duration": {
    "fast": { "$value": "180ms", "$type": "duration" },
    "base": { "$value": "280ms", "$type": "duration" },
    "slow": { "$value": "480ms", "$type": "duration" }
  }
}
```

- [ ] **Step 4.4: Append motion block + reduce-motion media query to `css/tokens.css`**

Inside `:root { ... }`, after shadow block:

```css
/* ─── Motion ─── */
--ease-page: cubic-bezier(0.32, 0.72, 0, 1);
--ease-ink: cubic-bezier(0.16, 1, 0.3, 1);
--ease-fold: cubic-bezier(0.7, 0, 0.84, 0);
--duration-fast: 180ms;
--duration-base: 280ms;
--duration-slow: 480ms;
```

After the closing `}` of `:root`, add at file end:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
```

- [ ] **Step 4.5: Run test to verify it passes**

Run: `npm test -- motion-tokens`
Expected: PASS — 6 ease tests + 6 duration tests + 1 monotonic + 1 reduce-motion = 14.

- [ ] **Step 4.6: Commit**

```bash
git add tokens/motion.json css/tokens.css tests/motion-tokens.test.ts
git commit -m "feat(tokens): add v2 motion (3 ease + 3 duration, reduce-motion safe)"
```

---

## Task 5: tokens/index.json + full suite verification

**Files:**

- Modify: `tokens/index.json`

- [ ] **Step 5.1: Update `tokens/index.json`**

Replace existing content with:

```json
{
  "$schema": "https://tr.designtokens.org/format/",
  "name": "dantelabs-design-system",
  "version": "1.1.0",
  "includes": [
    "./color.json",
    "./typography.json",
    "./spacing.json",
    "./radius.json",
    "./shadow.json",
    "./motion.json"
  ]
}
```

- [ ] **Step 5.2: Run full test suite**

Run: `npm test`
Expected: ALL pass — existing color/typography tests + new spacing/radius/shadow/motion tests.

- [ ] **Step 5.3: Commit**

```bash
git add tokens/index.json
git commit -m "chore(tokens): bump index to v1.1.0 with v2 token includes"
```

---

## Task 6: Per-family docs (4 files)

**Files:**

- Create: `docs/spacing.md`, `docs/radius.md`, `docs/shadow.md`, `docs/motion.md`

각 파일은 spec §2~§5의 내용을 사용자 facing 문서로 정리. Spec과 분리되는 이유: spec은 설계 의사결정 기록, docs는 사용자가 토큰을 쓸 때 참조.

- [ ] **Step 6.1: Create `docs/spacing.md`**

```markdown
# Spacing

9스텝 spacing 스케일. 4의 배수 + 12px(편집 그리드 보조).

## 토큰

| 숫자 인덱스 | 값   | t-shirt 별칭 | 주 용도                           |
| ----------- | ---- | ------------ | --------------------------------- |
| `--space-1` | 4px  | `--space-xs` | 인라인 갭, 아이콘-라벨            |
| `--space-2` | 8px  | `--space-sm` | 컴포넌트 내부 패딩                |
| `--space-3` | 12px | —            | 카드 내부 행 갭                   |
| `--space-4` | 16px | `--space-md` | 카드 패딩 표준, 본문 단락 사이    |
| `--space-5` | 24px | —            | 섹션 내부 그룹 갭                 |
| `--space-6` | 32px | `--space-lg` | 섹션 사이 표준                    |
| `--space-7` | 48px | —            | 큰 섹션 분리                      |
| `--space-8` | 64px | `--space-xl` | hero 위/아래 패딩                 |
| `--space-9` | 96px | —            | hero/landing section divider 한정 |

## 사용 규칙

- 본문 단락 사이는 `--space-4`(16px) 표준
- 섹션 사이는 `--space-6`(32px) 표준, 큰 섹션은 `--space-7`(48px)
- `--space-9`(96px)는 hero·landing의 section divider에만
- 8의 배수가 아닌 12px(`--space-3`)는 카드 내부 행 갭에 한정

## 듀얼 네이밍

숫자 인덱스가 표준, t-shirt 별칭은 자주 쓰는 5개에만 alias 제공. 같은 값이면 어느 쪽을 써도 무방.
```

- [ ] **Step 6.2: Create `docs/radius.md`**

```markdown
# Radius

5개 radius 토큰. 8px가 일반 직사각형 요소의 상한.

## 토큰

| 토큰            | 값     | 용도                                             |
| --------------- | ------ | ------------------------------------------------ |
| `--radius-none` | 0      | 의도적 각진 모서리 (에디토리얼 카드, full-bleed) |
| `--radius-sm`   | 2px    | 태그, 인풋, 코드 블록                            |
| `--radius-md`   | 4px    | 카드, 버튼 (표준)                                |
| `--radius-lg`   | 8px    | 모달, hero 카드 — 상한                           |
| `--radius-full` | 9999px | pill 버튼, 원형 아바타, 인디케이터 dot           |

## 사용 규칙

- 8px 초과 모서리 금지 — `--radius-lg`(8px)가 상한
- `--radius-full`은 명시 예외 — pill·circle 형상에만, 일반 카드/버튼에 사용 금지
```

- [ ] **Step 6.3: Create `docs/shadow.md`**

```markdown
# Shadow

Editorial emboss — 헤어라인 인셋 + 소프트 드롭. 모든 그림자는 `rgba(26, 26, 26, ...)` ink-tint.

## 토큰

| 토큰            | 값                                                             | 용도                                |
| --------------- | -------------------------------------------------------------- | ----------------------------------- |
| `--shadow-none` | `none`                                                         | 명시적 그림자 제거 (override·reset) |
| `--shadow-sm`   | `0 0 0 1px rgba(26,26,26,.06), 0 1px 2px rgba(26,26,26,.04)`   | 인풋, 보조 카드                     |
| `--shadow-md`   | `0 0 0 1px rgba(26,26,26,.08), 0 3px 6px rgba(26,26,26,.06)`   | 표준 카드 (default)                 |
| `--shadow-lg`   | `0 0 0 1px rgba(26,26,26,.10), 0 8px 16px rgba(26,26,26,.08)`  | 모달, popover, dropdown             |
| `--shadow-xl`   | `0 0 0 1px rgba(26,26,26,.12), 0 16px 32px rgba(26,26,26,.10)` | hero card, full-screen overlay      |

## 사용 규칙

- 카드 default는 `--shadow-md`. hover 시 `--shadow-lg`로 한 단계 상승 OK
- 컬러 섀도(rust/sepia/slate hex tint) 금지 — ink-tint 전용
- 같은 화면에 `--shadow-xl`은 1회만 (hero 등)
- 헤어라인 인셋이 이미 1px border 효과를 내므로 `border: 1px solid` 와 동시 사용 금지
```

- [ ] **Step 6.4: Create `docs/motion.md`**

```markdown
# Motion

Editorial paper — 종이 한 장이 미끄러지듯, 잉크가 종이에 스미듯. 스프링·바운스 금지.

## Easing

| 토큰          | cubic-bezier                   | 용도                                         |
| ------------- | ------------------------------ | -------------------------------------------- |
| `--ease-page` | `cubic-bezier(.32, .72, 0, 1)` | 기본 — UI transitions, hover, focus          |
| `--ease-ink`  | `cubic-bezier(.16, 1, .3, 1)`  | enter — fade-in, reveal, modal/dropdown 진입 |
| `--ease-fold` | `cubic-bezier(.7, 0, .84, 0)`  | exit — fade-out, dismissal, modal close      |

## Duration

| 토큰              | 값    | 용도                         |
| ----------------- | ----- | ---------------------------- |
| `--duration-fast` | 180ms | hover, focus, 색상 미세 변화 |
| `--duration-base` | 280ms | 표준 transition              |
| `--duration-slow` | 480ms | hero 진입, 페이지 transition |

## 사용 규칙

- 기본 transition: `transition: all var(--duration-base) var(--ease-page);`
- enter는 `--ease-ink`, exit는 `--ease-fold` 페어로
- `prefers-reduced-motion: reduce` 감지 시 모든 duration이 자동으로 `0ms` (CSS에서 일괄 처리됨)
- 스프링·overshoot·바운스 easing 금지
- `transition: all`은 hover/focus 마이크로 인터랙션에만 — 다른 곳에서는 명시적 속성 한정
```

- [ ] **Step 6.5: Commit**

```bash
git add docs/spacing.md docs/radius.md docs/shadow.md docs/motion.md
git commit -m "docs: add v2 token usage docs (spacing/radius/shadow/motion)"
```

---

## Task 7: Update usage-rules.md and README.md

**Files:**

- Modify: `docs/usage-rules.md`
- Modify: `docs/README.md`

- [ ] **Step 7.1: Read existing `docs/usage-rules.md` and append v2 section**

After existing content, append:

```markdown
---

## v2: Spacing · Radius · Shadow · Motion

자세한 사용 규칙은 각 토큰 문서 참조:

- [spacing.md](spacing.md) — 9스텝, 듀얼 네이밍
- [radius.md](radius.md) — 8px 상한, full은 pill 예외
- [shadow.md](shadow.md) — editorial emboss, ink-tint 전용
- [motion.md](motion.md) — editorial paper, reduce-motion 자동 대응

### 핵심 페어링·금지

- shadow와 `border: 1px solid border.default` 동시 사용 금지 (헤어라인 인셋이 중복)
- shadow는 ink-tint 전용 — rust/sepia/slate hex 그림자 금지
- radius 8px 초과 금지 — `--radius-full`은 pill·circle 명시 예외
- motion은 스프링·바운스 금지, `transition: all`은 hover/focus 한정
```

- [ ] **Step 7.2: Update `docs/README.md` 토큰 목록**

Find the section listing 문서 links (현재 color.md / typography.md / usage-rules.md). Replace with:

```markdown
## 문서

- [color.md](color.md) · 컬러 토큰 전체·명암비
- [typography.md](typography.md) · 타이포 스케일·사용 예
- [spacing.md](spacing.md) · 9스텝 spacing
- [radius.md](radius.md) · 5개 radius
- [shadow.md](shadow.md) · editorial emboss shadow
- [motion.md](motion.md) · editorial paper motion
- [usage-rules.md](usage-rules.md) · pairing·접근성·Do/Don't
```

Also update the "v2 이후" 섹션. Find:

```
## v2 이후

- Spacing / radius / shadow / motion 토큰
```

Replace with:

```markdown
## v2 이후 (현 버전 v1.1.0에서 진행)

- ✅ Spacing / radius / shadow / motion 토큰 (v1.1.0)
- 컴포넌트 라이브러리
- Dark mode 매핑
- Figma 라이브러리 ([figma/library-plan.md](../figma/library-plan.md))
```

- [ ] **Step 7.3: Commit**

```bash
git add docs/usage-rules.md docs/README.md
git commit -m "docs: cross-link v2 token docs and update v1.1.0 status"
```

---

## Task 8: Preview HTML — v2 token showcase

**Files:**

- Modify: `preview/index.html`

기존 `preview/index.html`은 color/typography만 시연. v2 토큰의 실제 렌더링을 사용자가 브라우저에서 검증할 수 있도록 4개 섹션 추가.

- [ ] **Step 8.1: Read `preview/index.html` to find insertion point**

Run:

```bash
grep -n '</body>' preview/index.html
grep -n '<title>' preview/index.html
```

Note the line number of `</body>` — v2 sections will be inserted right before it.

- [ ] **Step 8.2: Update title and insert v2 sections**

Change `<title>단테랩스 디자인 시스템 v1 · Preview</title>` to `<title>단테랩스 디자인 시스템 v1.1 · Preview</title>`.

Right before `</body>`, insert:

```html
<!-- ─── v2 토큰 ─── -->
<section
  style="padding: var(--space-8) var(--space-6); border-top: 1px solid var(--border);"
>
  <h2 class="type-h2" style="margin-bottom: var(--space-6);">v1.1 · Spacing</h2>
  <div style="display: flex; flex-direction: column; gap: var(--space-2);">
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-1</code>
      <div
        style="width: var(--space-1); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">4px · xs</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-2</code>
      <div
        style="width: var(--space-2); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">8px · sm</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-3</code>
      <div
        style="width: var(--space-3); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">12px</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-4</code>
      <div
        style="width: var(--space-4); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">16px · md</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-5</code>
      <div
        style="width: var(--space-5); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">24px</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-6</code>
      <div
        style="width: var(--space-6); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">32px · lg</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-7</code>
      <div
        style="width: var(--space-7); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">48px</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-8</code>
      <div
        style="width: var(--space-8); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">64px · xl</span>
    </div>
    <div style="display:flex; align-items:center; gap: var(--space-4);">
      <code style="width:120px;">--space-9</code>
      <div
        style="width: var(--space-9); height: 16px; background: var(--color-rust);"
      ></div>
      <span class="type-meta">96px</span>
    </div>
  </div>
</section>

<section
  style="padding: var(--space-8) var(--space-6); border-top: 1px solid var(--border);"
>
  <h2 class="type-h2" style="margin-bottom: var(--space-6);">v1.1 · Radius</h2>
  <div
    style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-4);"
  >
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; border: 1px solid var(--border-strong); border-radius: var(--radius-none);"
    >
      <code>--radius-none</code>
      <div class="type-meta">0</div>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; border: 1px solid var(--border-strong); border-radius: var(--radius-sm);"
    >
      <code>--radius-sm</code>
      <div class="type-meta">2px</div>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; border: 1px solid var(--border-strong); border-radius: var(--radius-md);"
    >
      <code>--radius-md</code>
      <div class="type-meta">4px</div>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; border: 1px solid var(--border-strong); border-radius: var(--radius-lg);"
    >
      <code>--radius-lg</code>
      <div class="type-meta">8px</div>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; border-radius: var(--radius-full);"
    >
      <code>--radius-full</code>
      <div class="type-meta">9999px</div>
    </div>
  </div>
</section>

<section
  style="padding: var(--space-8) var(--space-6); border-top: 1px solid var(--border);"
>
  <h2 class="type-h2" style="margin-bottom: var(--space-6);">v1.1 · Shadow</h2>
  <div
    style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-7);"
  >
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; box-shadow: var(--shadow-sm);"
    >
      <code>--shadow-sm</code>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; box-shadow: var(--shadow-md);"
    >
      <code>--shadow-md</code>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; box-shadow: var(--shadow-lg);"
    >
      <code>--shadow-lg</code>
    </div>
    <div
      style="background: var(--bg-surface); padding: var(--space-6); text-align: center; box-shadow: var(--shadow-xl);"
    >
      <code>--shadow-xl</code>
    </div>
  </div>
</section>

<section
  style="padding: var(--space-8) var(--space-6); border-top: 1px solid var(--border);"
>
  <h2 class="type-h2" style="margin-bottom: var(--space-6);">v1.1 · Motion</h2>
  <p class="type-body-sm" style="margin-bottom: var(--space-4);">
    호버하면 각 easing으로 미끄러집니다.
  </p>
  <style>
    .motion-track {
      position: relative;
      height: 32px;
      background: var(--bg-subtle);
      border-radius: var(--radius-sm);
      margin-bottom: var(--space-2);
      overflow: hidden;
    }
    .motion-ball {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 24px;
      height: 24px;
      background: var(--color-rust);
      border-radius: var(--radius-sm);
      transition: left var(--duration-base) var(--ease-page);
    }
    .motion-row:hover .motion-ball {
      left: calc(100% - 28px);
    }
    .motion-row.ink .motion-ball {
      transition-timing-function: var(--ease-ink);
    }
    .motion-row.fold .motion-ball {
      transition-timing-function: var(--ease-fold);
    }
  </style>
  <div class="motion-row">
    <code>--ease-page</code>
    <div class="motion-track"><div class="motion-ball"></div></div>
  </div>
  <div class="motion-row ink">
    <code>--ease-ink</code>
    <div class="motion-track"><div class="motion-ball"></div></div>
  </div>
  <div class="motion-row fold">
    <code>--ease-fold</code>
    <div class="motion-track"><div class="motion-ball"></div></div>
  </div>
</section>
```

- [ ] **Step 8.3: Verify in browser**

Run:

```bash
open preview/index.html
```

Expected: 기존 color/typography 섹션 뒤에 4개의 v2 섹션이 보임. spacing 9개 막대, radius 5개 카드, shadow 4단계, motion hover 시 슬라이드 애니메이션.

- [ ] **Step 8.4: Commit**

```bash
git add preview/index.html
git commit -m "feat(preview): add v2 token showcase (spacing/radius/shadow/motion)"
```

---

## Task 9: CHANGELOG, version bump, git tag

**Files:**

- Create: `CHANGELOG.md`
- Modify: `package.json`

- [ ] **Step 9.1: Create `CHANGELOG.md`**

```markdown
# Changelog

본 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.1.0] — 2026-05-07

### Added

- **Spacing** 토큰 9스텝 (`--space-1` ~ `--space-9`, 4–96px) + t-shirt 별칭 5개 (xs/sm/md/lg/xl)
- **Radius** 토큰 5개 (`--radius-none`/`-sm`/`-md`/`-lg`/`-full`)
- **Shadow** 토큰 5개 (editorial emboss, 헤어라인 인셋 + 소프트 드롭, ink-tint 전용)
- **Motion** 토큰 — easing 3개 (`--ease-page`/`-ink`/`-fold`) + duration 3개 (`--duration-fast`/`-base`/`-slow`)
- `prefers-reduced-motion: reduce` 자동 대응 (모든 duration → 0ms)
- `docs/spacing.md`, `docs/radius.md`, `docs/shadow.md`, `docs/motion.md` 신규
- `tests/spacing-tokens.test.ts`, `tests/radius-tokens.test.ts`, `tests/shadow-tokens.test.ts`, `tests/motion-tokens.test.ts` 추가
- `preview/index.html`에 v2 토큰 시연 섹션 추가

### Fixed

- 기존 스킬 `preview/14-shadow.html`의 "rust-tinted" 라벨이 do-dont의 "컬러 섀도 금지" 규칙과 충돌했던 것을 ink-tint로 정정 (스펙: `docs/superpowers/specs/2026-05-07-design-system-v2-tokens-design.md`).

### Changed

- `tokens/index.json` version 1.0.0 → 1.1.0
- `docs/README.md`의 "v2 이후" 섹션에 spacing/radius/shadow/motion 완료 표시

## [1.0.0] — 2026-04-24

### Added

- 컬러 토큰 14개 (paper/ink/rust 포함)
- Typography Editorial 5단 + UI 9단 스케일
- DTCG JSON + CSS Custom Properties 듀얼 포맷
- vitest 기반 토큰 일치 검증
- `preview/index.html` 시연 페이지
```

- [ ] **Step 9.2: Update `package.json`**

Change:

```json
{
  "name": "dantelabs-design-system",
  "version": "1.0.0",
  "description": "단테랩스 디자인 시스템 v1 - 컬러 토큰 + 타이포그래피",
```

To:

```json
{
  "name": "dantelabs-design-system",
  "version": "1.1.0",
  "description": "단테랩스 디자인 시스템 - 컬러·타이포·spacing·radius·shadow·motion 토큰",
```

- [ ] **Step 9.3: Run full test suite one more time**

Run: `npm test`
Expected: ALL pass.

- [ ] **Step 9.4: Commit and tag**

```bash
git add CHANGELOG.md package.json
git commit -m "chore: release v1.1.0 (spacing/radius/shadow/motion)"
git tag v1.1.0 -m "v1.1.0 — spacing/radius/shadow/motion tokens"
git push origin main --tags
```

Expected: tag pushed to https://github.com/dandacompany/dantelabs-design-system

---

## Self-Review Checklist (already performed)

- **Spec coverage:**
  - §2 Spacing → Task 1 ✓
  - §3 Radius → Task 2 ✓
  - §4 Shadow → Task 3 ✓
  - §5 Motion → Task 4 ✓
  - §6 DTCG JSON 포맷 → Task 1.3, 2.3, 3.3, 4.3 ✓
  - §7 CSS 출력 → Task 1.4, 2.4, 3.4, 4.4 ✓
  - §8 테스트 → Task 1.1, 2.1, 3.1, 4.1 ✓
  - §9 Preview 카드 갱신 → 별도 task로 위임 (스킬 흡수 단계, 이 플랜의 범위 밖)
  - §10 마이그레이션 영향 → Task 9 (version bump + CHANGELOG) ✓
  - §11 진행 순서 → Task 1~9 매핑 ✓

- **Placeholder scan:** TBD/TODO/"add appropriate" 없음. 모든 step에 실제 코드/명령 포함.

- **Type consistency:** `parseCustomProperties`, `resolveToken`, `loadJsonTokens` 시그니처가 모든 테스트에서 동일하게 사용됨. shadow의 `$type: "shadow"`, motion의 `$type: "cubicBezier"`, `$type: "duration"`은 DTCG 표준 타입.
