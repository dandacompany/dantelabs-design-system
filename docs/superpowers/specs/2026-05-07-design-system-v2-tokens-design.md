# 단테랩스 디자인 시스템 v2 토큰 설계

**날짜**: 2026-05-07
**범위**: spacing · radius · shadow · motion 4개 토큰 패밀리
**선행**: v1(color + typography) — `2026-04-24-dantelabs-design-system-design.md`
**Repo**: dandacompany/dantelabs-design-system

## 1. 목표 · 비목표

### 목표

- v1 spec §"제외(v2 이후)"에 placeholder만 있던 4개 토큰 패밀리를 정식 토큰으로 정의한다.
- 기존 스킬(`~/.claude/skills/dantelabs-design`)의 preview 카드 12·13·14에 implicit하게 박힌 prior art를 공식 스펙으로 승격하고, **컬러 섀도 금지 규칙과 충돌하던 "rust-tinted lg shadow"를 ink-tint로 정정**한다.
- 단테랩스 무드 — 에디토리얼·명조 세리프·종이/잉크/러스트 — 와 일관된 값을 사용한다.
- DTCG JSON + CSS Custom Properties 두 포맷을 동기화하고 vitest로 일치 검증한다.

### 비목표

- v1의 color · typography 토큰 변경 — 손대지 않는다.
- 컴포넌트 라이브러리(React/Vue) 추가 — 별도 작업.
- Dark mode 매핑 — semantic 재정의는 v2.1 이상에서 다룬다.
- Figma 토큰 연동 — `figma/library-plan.md`의 별도 트랙.

## 2. Spacing

### 2.1 스케일

9스텝. 4의 배수가 기본, 12px만 편집 그리드 보조용 예외. 96px는 hero/section divider 한정.

| 숫자 인덱스 | 값   | t-shirt 별칭 | 주 용도                                  |
| ----------- | ---- | ------------ | ---------------------------------------- |
| `--space-1` | 4px  | `--space-xs` | 인라인 갭, 아이콘-라벨, 태그 패딩        |
| `--space-2` | 8px  | `--space-sm` | 컴포넌트 내부 패딩, 라벨-인풋 갭         |
| `--space-3` | 12px | —            | 카드 내부 행 갭                          |
| `--space-4` | 16px | `--space-md` | 카드 패딩 표준, 본문 단락 사이           |
| `--space-5` | 24px | —            | 섹션 내부 그룹 갭, 카드 사이             |
| `--space-6` | 32px | `--space-lg` | 섹션 사이 표준                           |
| `--space-7` | 48px | —            | 큰 섹션 분리                             |
| `--space-8` | 64px | `--space-xl` | hero 위/아래 패딩                        |
| `--space-9` | 96px | —            | hero/landing 페이지 section divider 한정 |

### 2.2 듀얼 네이밍 운영

- **숫자 인덱스가 표준** — 토큰 정의의 source of truth.
- **t-shirt 별칭은 alias** — `--space-md: var(--space-4);` 형식으로 표준에 묶인다.
- 사용자는 둘 중 자유롭게 골라 쓴다. 명시적 의미(md=중간)와 정확한 인덱스(4=네 번째 단계) 모두 지원.
- 모든 9스텝에 별칭이 있는 건 아니다 — 자주 쓰는 5개(xs/sm/md/lg/xl)만 alias 제공. 나머지는 숫자만.

### 2.3 사용 규칙

- 본문 단락 사이는 `--space-4`(16px) 표준.
- 섹션 사이는 `--space-6`(32px) 표준, 큰 섹션은 `--space-7`(48px).
- `--space-9`(96px)는 hero·landing의 section divider에만. 일반 섹션 분리에 쓰지 않는다.
- 8의 배수가 아닌 12px(`--space-3`)는 카드 내부 행 갭에 한정 — 외부 컨테이너 갭에 쓰지 않는다.

## 3. Radius

### 3.1 토큰

| 토큰            | 값     | 용도                                                   |
| --------------- | ------ | ------------------------------------------------------ |
| `--radius-none` | 0      | 의도적 각진 모서리(에디토리얼 카드, full-bleed 이미지) |
| `--radius-sm`   | 2px    | 태그, 인풋, 코드 블록                                  |
| `--radius-md`   | 4px    | 카드, 버튼 (표준)                                      |
| `--radius-lg`   | 8px    | 모달, hero 카드 — **상한**                             |
| `--radius-full` | 9999px | pill 버튼, 원형 아바타, 인디케이터 dot                 |

### 3.2 사용 규칙

- v1 do-dont의 "8px 초과 모서리 금지" 규칙은 **유지** — `--radius-lg`(8px)가 일반 직사각형 요소의 상한.
- `--radius-full`은 명시된 예외 — pill·circle 형상에만. 일반 카드/버튼에 사용하지 않는다.
- `--radius-none`은 토큰 없이 `border-radius: 0;`으로도 가능하지만, "의도적 0"임을 명시하기 위해 토큰화한다 (특히 reset 용도).

## 4. Shadow

### 4.1 컨셉 — Editorial Emboss

활자 인쇄 무드. 모든 그림자는 **헤어라인 인셋(`0 0 0 1px`) + 소프트 드롭** 2층 구조. 종이 위에 카드가 "찍힌" 듯한 인쇄 느낌. 모든 값은 `rgba(26,26,26,…)` ink-tint — **v1 do-dont의 "컬러 드롭섀도 금지" 규칙 준수**.

### 4.2 토큰

| 토큰            | 값                                                             | 용도                                |
| --------------- | -------------------------------------------------------------- | ----------------------------------- |
| `--shadow-none` | `none`                                                         | 명시적 그림자 제거 (override·reset) |
| `--shadow-sm`   | `0 0 0 1px rgba(26,26,26,.06), 0 1px 2px rgba(26,26,26,.04)`   | 인풋, 보조 카드, 내부 분리          |
| `--shadow-md`   | `0 0 0 1px rgba(26,26,26,.08), 0 3px 6px rgba(26,26,26,.06)`   | 표준 카드 (default elevation)       |
| `--shadow-lg`   | `0 0 0 1px rgba(26,26,26,.10), 0 8px 16px rgba(26,26,26,.08)`  | 모달, popover, dropdown             |
| `--shadow-xl`   | `0 0 0 1px rgba(26,26,26,.12), 0 16px 32px rgba(26,26,26,.10)` | hero card, full-screen overlay      |

### 4.3 사용 규칙

- 카드의 default는 `--shadow-md`. hover에서 `--shadow-lg`로 한 단계 상승은 OK.
- 컬러 섀도(`rgba(160,82,45,…)` 등 rust/sepia/slate 그림자)는 **금지** — v1 do-dont 유지.
- 같은 화면에 `--shadow-xl`은 1회만 (hero 등).
- 인셋 헤어라인은 카드의 `border: 1px solid border.default`와 시각적으로 유사하므로, 두 가지를 동시에 쓰지 않는다 — `--shadow-md`를 쓰면 `border` 생략, 또는 그 반대.

### 4.4 정정 사항

기존 스킬 `preview/14-shadow.html`의 "lg · hero · rust-tinted" 라벨은 **잘못된 prior art**다. v2에서 ink-tint로 정정하고 라벨을 "lg · modals/popover"로 갱신한다.

## 5. Motion

### 5.1 컨셉 — Editorial Paper

종이 한 장이 미끄러지듯, 잉크가 종이에 스미듯. 스프링/바운스는 사용하지 않는다. base duration이 일반 머티리얼 표준(200ms)보다 약간 길어 deliberate한 느낌.

### 5.2 Easing

| 토큰          | cubic-bezier                | 용도                                         |
| ------------- | --------------------------- | -------------------------------------------- |
| `--ease-page` | `cubic-bezier(.32,.72,0,1)` | **기본** — UI transitions, hover, focus      |
| `--ease-ink`  | `cubic-bezier(.16,1,.3,1)`  | enter — fade-in, reveal, modal/dropdown 진입 |
| `--ease-fold` | `cubic-bezier(.7,0,.84,0)`  | exit — fade-out, dismissal, modal close      |

### 5.3 Duration

| 토큰              | 값    | 용도                                           |
| ----------------- | ----- | ---------------------------------------------- |
| `--duration-fast` | 180ms | hover, focus, 색상·미세 변화                   |
| `--duration-base` | 280ms | 표준 transition (이동·리사이즈·opacity)        |
| `--duration-slow` | 480ms | hero 진입, 페이지 transition, 큰 레이아웃 변화 |

### 5.4 사용 규칙

- 기본 transition: `transition: all var(--duration-base) var(--ease-page);`
- enter 모션은 `--ease-ink`, exit 모션은 `--ease-fold` 페어로 사용.
- `prefers-reduced-motion: reduce`이 감지되면 모든 transition을 `0ms`로 즉시 종료한다 (CSS에서 `@media (prefers-reduced-motion: reduce)` 블록 한 곳에서 일괄 처리).
- 스프링·overshoot·바운스 easing 금지 (단테랩스 무드 위반).
- 색상 transition은 `transition: color var(--duration-fast) var(--ease-page);` 등 명시적 속성 한정 — `transition: all`은 hover/focus 마이크로 인터랙션에만 허용.

## 6. 데이터 포맷 (DTCG JSON)

### 6.1 파일 구조

```
tokens/
├── color.json        (v1 — 변경 없음)
├── typography.json   (v1 — 변경 없음)
├── spacing.json      (신규)
├── radius.json       (신규)
├── shadow.json       (신규)
├── motion.json       (신규)
└── index.json        (전체 import 인덱스 — 갱신)
```

### 6.2 spacing.json 예시

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

### 6.3 radius.json 예시

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

### 6.4 shadow.json 예시 (DTCG `shadow` 타입은 배열 지원)

```json
{
  "shadow": {
    "none": { "$value": "none", "$type": "shadow" },
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
    }
  }
}
```

### 6.5 motion.json 예시

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

## 7. CSS 출력 (`css/tokens.css` 추가 블록)

기존 `--color-*`, `--font-*` 블록 뒤에 추가.

```css
:root {
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

  /* ─── Radius ─── */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* ─── Shadow (editorial emboss · ink-tint) ─── */
  --shadow-none: none;
  --shadow-sm:
    0 0 0 1px rgba(26, 26, 26, 0.06), 0 1px 2px rgba(26, 26, 26, 0.04);
  --shadow-md:
    0 0 0 1px rgba(26, 26, 26, 0.08), 0 3px 6px rgba(26, 26, 26, 0.06);
  --shadow-lg:
    0 0 0 1px rgba(26, 26, 26, 0.1), 0 8px 16px rgba(26, 26, 26, 0.08);
  --shadow-xl:
    0 0 0 1px rgba(26, 26, 26, 0.12), 0 16px 32px rgba(26, 26, 26, 0.1);

  /* ─── Motion ─── */
  --ease-page: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-ink: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-fold: cubic-bezier(0.7, 0, 0.84, 0);
  --duration-fast: 180ms;
  --duration-base: 280ms;
  --duration-slow: 480ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
```

## 8. 테스트 (vitest 확장)

기존 `tests/token-consistency.test.ts` 패턴을 따른다. 각 토큰 패밀리당 한 파일.

| 파일                           | 검증 내용                                                                  |
| ------------------------------ | -------------------------------------------------------------------------- |
| `tests/spacing-tokens.test.ts` | DTCG `space.N`과 CSS `--space-N` 값 일치, alias 참조 해결, 9스텝 누락 없음 |
| `tests/radius-tokens.test.ts`  | DTCG ↔ CSS 일치, 5개 토큰(none/sm/md/lg/full) 모두 존재                    |
| `tests/shadow-tokens.test.ts`  | CSS 문자열에 ink-tint(`rgba(26,26,26`)만 사용 — rust/sepia hex 미포함      |
| `tests/motion-tokens.test.ts`  | easing이 유효한 cubic-bezier 4-tuple, duration이 ms 단위 양의 정수         |

## 9. Preview 카드 갱신

기존 스킬(`~/.claude/skills/dantelabs-design/preview/`)에 다음 갱신·추가:

| 카드                             | 작업                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| `12-spacing-scale.html`          | 그대로 (이미 9스텝 표시 중) — t-shirt alias 라벨만 보강      |
| `13-radius.html`                 | none, full 추가 카드. 5개로 확장.                            |
| `14-shadow.html`                 | "rust-tinted" 라벨 제거. xl 추가. 4개로 확장. ink-tint 명시. |
| `22-motion-easing.html` (신규)   | 3 easing live demo (ball slide animation)                    |
| `23-motion-duration.html` (신규) | 3 duration 비교 (같은 ease로 fast/base/slow 동시 진행)       |

## 10. 마이그레이션 영향

- v1을 사용 중인 외부 코드는 **영향 없음** — v2는 토큰 추가만, 변경·삭제 없음.
- 기존 스킬 `preview/14-shadow.html`만 라벨/값이 바뀐다 — 외부 임포트 영향 없음 (preview는 시연 전용).
- `package.json` semver: `1.0.0` → `1.1.0` (minor — 토큰 추가).

## 11. 진행 순서 (writing-plans로 넘길 작업 분해)

1. tokens/spacing.json + radius.json + shadow.json + motion.json 작성
2. tokens/index.json 갱신 (4개 신규 import 추가)
3. css/tokens.css에 spacing/radius/shadow/motion 블록 추가
4. tests/ 4개 파일 추가, vitest 통과 확인
5. docs/ 갱신:
   - docs/spacing.md (신규)
   - docs/radius.md (신규)
   - docs/shadow.md (신규)
   - docs/motion.md (신규)
   - docs/usage-rules.md에 v2 섹션 추가
   - docs/README.md 토큰 목록 갱신
6. preview/index.html에 v2 토큰 시연 추가
7. CHANGELOG.md 신규 작성 (v1.0.0, v1.1.0 항목)
8. git tag v1.1.0
