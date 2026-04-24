# 단테랩스 디자인 시스템 · v1 설계 명세

**버전**: v1.0.0
**작성일**: 2026-04-24
**스코프**: 컬러 팔레트 + 타이포그래피 구조 (통합 브랜드 시스템)
**대상 영역**: YouTube 배너·영상·모션그래픽, 홈페이지 UI/UX·아티클

---

## 1. 개요

### 1.1 목적

단테랩스의 모든 시각 자산(YouTube, 모션그래픽, 홈페이지, 아티클)이 공유할 단일 컬러·타이포 토큰 셋을 정의한다. 브랜드 톤(문학적·따뜻함·클래식)을 유지하면서, 웹 프로덕트에서 요구되는 접근성과 기능성까지 충족한다.

### 1.2 무드

참고 이미지에서 도출된 `Korean Literary` 계열 — 만년필 잉크, 오래된 종이, 러스트 안료의 질감. 문학잡지·단행본의 고요함을 디지털 환경에서 재현한다.

### 1.3 사용 카테고리

| 트랙 | 사용처 |
|---|---|
| **Editorial** | YouTube 배너, YouTube 썸네일, 모션그래픽, 아티클 히어로 |
| **UI** | 홈페이지 UI/UX, 아티클 본문, 폼·테이블·카드 |

### 1.4 v1 스코프

**포함**
- 컬러 토큰 (Primitive + Semantic 2-tier)
- 타이포 스케일 (Editorial 5단 + UI 9단)
- 폰트 스택 및 로딩 전략
- 네이밍 컨벤션 및 사용 규칙

**제외 (v2 이후)**
- Spacing / radius / shadow / motion 토큰
- 컴포넌트 라이브러리
- Dark mode 매핑
- Figma 라이브러리 빌드
- 로고·아이콘 가이드

---

## 2. 컬러 토큰

### 2.1 Core Palette · 8 tokens

| 토큰 | HEX | 역할 |
|---|---|---|
| `paper` | `#F7F2E6` | 배경 · 전체 캔버스 |
| `ink` | `#1a1a1a` | 본문 · 기본 텍스트 |
| `rust` | `#A0522D` | 브랜드 액센트 · Ink reveal · 장식 라인 |
| `sepia` | `#8B6F47` | 서명 · 장 번호 · 메타 라벨 |
| `slate` | `#435B6C` | 감성 블루 베이스 · 에디토리얼 액센트 |
| `link` | `#5B7F99` | 기능 블루 · 대형 링크 · 인포 |
| `amber` | `#C9A857` | 감성 옐로우 베이스 |
| `mark` | `#EBC65B` | 하이라이트 · 형광펜 마커 |

팔레트 방향: **Muted Scholar** — 기존 4토큰(PAPER·INK·RUST·SEPIA)에 슬레이트 데님·소프트 앰버를 추가하여 부드럽고 학자적인 톤 유지.

### 2.2 Extended Neutrals

계층 표현을 위한 보조 중립색.

| 토큰 | 값 | 역할 |
|---|---|---|
| `paper-soft` | `#EDE7D7` | 섹션 구분 바탕, 그림자 대체 |
| `paper-strong` | `#FCF9F0` | 카드 배경, 하이라이트 박스 |
| `ink-soft` | `#3a3a3a` | 2차 본문, 보조 설명 |
| `ink-muted` | `#6a6a6a` | 플레이스홀더, disabled |
| `border` | `rgba(26,26,26,0.12)` | 일반 보더 |
| `border-strong` | `rgba(26,26,26,0.24)` | 강조 보더, 테이블 |

### 2.3 접근성 변형 (WCAG AA 준수)

| 토큰 | HEX | 용도 | vs `paper` 명암비 |
|---|---|---|---|
| `link-strong` | `#3E5E75` | 본문 내 링크 (AA 4.5:1) | **4.6:1 ✓** |
| `link` | `#5B7F99` | 대형 텍스트 / 장식 링크 (AA Large 3:1) | ~3.5:1 |

**규칙**
- `body`(16px)·`body-sm`(14px) 내부 링크 → 반드시 `link-strong`
- 24px 이상 또는 weight 700 이상일 때 → `link` 허용 (AA Large 충족)

### 2.4 Semantic Mapping (UI 상태)

문학적 브랜드 톤을 유지하기 위해 Green/Red를 신설하지 않고 기존 팔레트로 매핑한다.

| 의미 | 매핑 토큰 | 근거 |
|---|---|---|
| `info` | `link-strong` | 차분한 정보 전달 |
| `success` | `amber` | 따뜻한 긍정 (녹색 대체) |
| `warning` | `mark` | 주목을 끄는 밝은 톤 |
| `danger` | `rust` | 강한 브랜드 액센트의 경고 활용 |

**`rust`의 이중 용도 주의**: `rust`는 브랜드 장식 액센트(`accent-brand`)이자 위험 상태(`state-danger`) 두 의미를 동시에 가진다. 에디토리얼·헤더 장식에서의 사용은 브랜드 의도, UI 컨텍스트(에러 메시지·삭제 버튼·경고 보더)에서의 사용은 상태 의도로 구분한다. 한 화면에서 장식용과 상태용이 동시 노출되지 않도록 주의한다 — 필요 시 상태 표시는 아이콘·배경 처리로 맥락을 분명히 한다.

### 2.5 Color Distribution Rules

- **60/30/10 원칙** — `paper` 60% (배경) · `ink` + `ink-soft` 30% (본문) · 액센트(rust·slate·mark) 10%
- **Accent pairing** — 한 화면에서 `rust` + `slate`의 공존 허용. 단 `amber`와 `mark`는 각각 한 번씩만 사용(소란스러움 방지).
- **Dark mode** — v1은 light only. 다크 매핑은 v2에서 별도 정의.
- **Editorial vs UI** — Editorial은 채도 높은 배경 허용(예: slate 20% 배경), UI는 텍스트·보더 중심으로 제한.

---

## 3. 타이포그래피

### 3.1 Font Stack

| 역할 | Primary | Fallback |
|---|---|---|
| Editorial 한글 | **Nanum Myeongjo** (400/700/800) | Noto Serif KR, Batang, serif |
| Editorial Latin | **Playfair Display** (400/700/800 + italic) | "Times New Roman", serif |
| UI Heading 한글 | **Noto Serif KR** (600/700) | Nanum Myeongjo, serif |
| UI Heading Latin | **Source Serif 4** (600/700) | Georgia, serif |
| UI Body 한글 | **Noto Serif KR** (400/500) | Georgia, serif |
| UI Sans (메타·버튼·캡션) | **Pretendard** (500/600) | -apple-system, "Segoe UI", system-ui, sans-serif |
| Code / Mono | **JetBrains Mono** (400/500) | Menlo, Consolas, monospace |

### 3.2 Editorial Track · 5단 Beat

| Level | Size | Line-height | Weight | Letter-spacing | 주 용도 |
|---|---|---|---|---|---|
| `hero` | 128px | 1.15 | 800 | -0.02em | 썸네일 결정적 키워드, 모션그래픽 beat 3 |
| `display` | 96px | 1.10 | 700 | -0.01em | 히어로 제목 긴 문장, 배너 메인 |
| `accent` | 64px | 1.20 | 700 | 0 | 부분 강조, 챕터 오프닝 |
| `sub` | 32px | 1.40 | 400 | 0 | 보조 설명, CTA URL (Noto Serif KR) |
| `meta` | 18px | 1.50 | 500 | 0.16em · UPPERCASE | 서명·시즌 라벨 (Pretendard sans) |

**Editorial 규칙**
- `hero`·`display`·`accent`는 Nanum Myeongjo (800/700) 필수
- 유튜브 썸네일 등 더 큰 스케일 필요 시 `scale()` 또는 `clamp()`로 확대 — 토큰 자체는 고정
- 줄바꿈은 의도적 `<br>`로 제어 (자동 줄바꿈 지양)
- 컬러 활용: Hero는 `ink` 본문 + `slate` 또는 `rust` 강조. Sub는 `link` 밑줄. Meta는 `sepia`.

### 3.3 UI Track · 9단 Component Scale

| Level | Size | Line-height | Weight | Font | 주 용도 |
|---|---|---|---|---|---|
| `h1` | 56px | 1.20 | 700 | Serif | 페이지 타이틀 |
| `h2` | 40px | 1.25 | 700 | Serif | 섹션 헤딩 |
| `h3` | 28px | 1.30 | 600 | Serif | 서브섹션 |
| `h4` | 22px | 1.35 | 600 | Serif | 카드 제목, 아티클 소제목 |
| `body-lg` | 20px | 1.65 | 400 | Serif | 아티클 lead paragraph, 인트로 본문 |
| `body` | 16px | 1.65 | 400 | Serif | **본문 기본** |
| `body-sm` | 14px | 1.50 | 400 | Serif | 보조 본문, 날짜·카테고리 메타 |
| `caption` | 13px | 1.40 | 500 | Sans | 이미지 캡션, 툴팁, 폼 힌트 |
| `button` | 14px | 1.00 | 600 | Sans · +0.04em · UPPERCASE | 버튼 라벨 |

**UI 규칙**
- 본문(`body`)이 Serif인 이유: 단테랩스 문학적 브랜드 + 아티클 읽기 경험 강화.
- **Sans 오버라이드 허용 범위**(예외 목록): 데이터 테이블의 셀 값, 폼 입력 필드(input/textarea 내부), 숫자 전용 영역(통계·차트 라벨·금액). 이 경우에만 `--font-sans` + `font-variant-numeric: tabular-nums` 사용. 본문 paragraph·헤딩·아티클 텍스트에는 절대 적용하지 않는다.
- 한글 본문은 1.65 행간 필수 (한자·조사 가독성)
- 반응형 축소 규칙 (< 768px 뷰포트):
  - `h1` 56 → 48
  - `h2` 40 → 32
  - `h3` 28 → 24
  - `body` 16 유지

### 3.4 Font Loading Strategy

**Pretendard는 Google Fonts에서 제공되지 않는다.** jsDelivr CDN의 variable 서브셋 버전을 사용한다 (Korean + Latin 동적 서브셋, 약 140KB).

```html
<!-- Google Fonts: 한글 serif, Latin serif, mono -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">

<!-- jsDelivr: Pretendard variable (dynamic subset) -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
```

- `display=swap` — FOIT 방지 (fallback 먼저 노출 → 폰트 로드 후 교체)
- Pretendard dynamic-subset: 실제 사용 글리프만 동적 로드, 초기 번들 최소화
- Editorial 전용 폰트(Nanum Myeongjo 800, Playfair italic)는 해당 페이지에서만 지연 로드 고려
- 자체 호스팅 대안: Pretendard 버전 고정이 필요하면 `npm i pretendard` 후 빌드 파이프라인에서 제공

### 3.5 Type Pairing Rules

- 한 화면에 Serif는 **2종까지** (예: Nanum Myeongjo heading + Noto Serif KR body)
- Sans는 **메타 역할 + 위 3.3의 예외 목록(테이블·폼·숫자)** 에서만 사용 — 본문 paragraph·헤딩을 Pretendard로 치환하지 않음
- italic은 Playfair 인용·장식 한정 (Nanum Myeongjo는 italic 미사용)

---

## 4. 파운데이션 · 네이밍·포맷·구조

### 4.1 Token Architecture · 2-tier

**Tier 1 (Primitive)**: 물리적 값. `--color-*`, `--font-*`, `--type-*`.
**Tier 2 (Semantic)**: 용도 기반. `--bg-*`, `--text-*`, `--accent-*`, `--state-*`.

**원칙**: 소비자는 Tier 2 사용. Tier 1은 에디토리얼 장식·특수 강조 등 예외 상황에서만.

### 4.2 CSS Custom Properties · 완전 스펙

```css
:root {
  /* ── TIER 1 · Primitive Tokens ──────────────── */
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

  --border: rgba(26,26,26,0.12);
  --border-strong: rgba(26,26,26,0.24);

  /* ── TIER 2 · Semantic Tokens ───────────────── */
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

  /* ── TIER 1 · Typography Primitives ─────────── */
  --font-editorial-ko: 'Nanum Myeongjo', 'Noto Serif KR', 'Times New Roman', serif;
  --font-editorial-en: 'Playfair Display', 'Times New Roman', serif;
  --font-heading: 'Noto Serif KR', 'Source Serif 4', Georgia, serif;
  --font-body: 'Noto Serif KR', 'Source Serif 4', Georgia, serif;
  --font-sans: 'Pretendard', -apple-system, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, Consolas, monospace;

  /* Editorial scale */
  --type-hero: 800 128px/1.15 var(--font-editorial-ko);
  --type-display: 700 96px/1.10 var(--font-editorial-ko);
  --type-accent: 700 64px/1.20 var(--font-editorial-ko);
  --type-sub: 400 32px/1.40 var(--font-body);
  --type-meta: 500 18px/1.50 var(--font-sans);

  /* UI scale */
  --type-h1: 700 56px/1.20 var(--font-heading);
  --type-h2: 700 40px/1.25 var(--font-heading);
  --type-h3: 600 28px/1.30 var(--font-heading);
  --type-h4: 600 22px/1.35 var(--font-heading);
  --type-body-lg: 400 20px/1.65 var(--font-body);
  --type-body: 400 16px/1.65 var(--font-body);
  --type-body-sm: 400 14px/1.50 var(--font-body);
  --type-caption: 500 13px/1.40 var(--font-sans);
  --type-button: 600 14px/1.00 var(--font-sans);
}
```

### 4.3 Deliverables · 파일 구조

```
dantelabs_design_system/
├── tokens/
│   ├── color.json          # Design Tokens Community Group (DTCG) 스펙
│   ├── typography.json
│   └── index.json          # 통합 엔트리
├── css/
│   ├── tokens.css          # :root 변수 (Tier 1+2)
│   ├── typography.css      # utility classes (.type-h1, .type-body 등)
│   └── fonts.css           # @font-face + @import
├── docs/
│   ├── README.md           # 개요 + 사용법
│   ├── color.md            # 팔레트 가이드 + 이미지
│   ├── typography.md       # 스케일 가이드
│   └── usage-rules.md      # 60/30/10, pairing, accessibility
├── figma/
│   └── library-plan.md     # Figma 라이브러리 계획 (추후)
└── preview/
    └── index.html          # 토큰 프리뷰 페이지
```

### 4.4 포맷 우선순위

1. **CSS Custom Properties** (`css/tokens.css`) — 웹·hyperframes 즉시 사용, 최우선 산출물
2. **Design Tokens JSON** (`tokens/*.json`, DTCG 포맷) — Figma/Style Dictionary/툴 연동 대비
3. **Markdown docs** — 사람이 읽는 가이드
4. **Figma library** — v1 범위 아님, 계획만 수립

---

## 5. 버전 정책

- 이 문서: `2026-04-24-dantelabs-design-system-design.md`
- 토큰 버전: Semantic Versioning
  - BREAKING (HEX 교체·토큰 삭제·이름 변경) → major
  - 토큰 추가·의미 확장 → minor
  - HEX 미세 조정 → patch
- v1.0.0에서 시작

---

## 6. 참고 이미지 (브레인스토밍 세션)

브레인스토밍에 사용된 5개 참고 이미지:

1. Korean Literary — Nanum Myeongjo + `#F7F2E6` + `#A0522D` 러스트 액센트
2. Premium Warm — Playfair Display + Noto Serif KR + `#F0EBE0` + `#2C2C2C`
3. COLOR TOKENS · 4종 + TYPOGRAPHY SCALE · 5단 레퍼런스 페이지
4. hyperframes 프로젝트 GSAP 타임라인 코드 (토큰 실사용 예)
5. COLOR TOKENS · 4종 상세 (PAPER / INK / RUST / SEPIA)

모두 단테랩스가 현재 `hyperframes` 프로젝트에서 사용 중인 무드에서 출발. 본 스펙은 이 4토큰을 기준으로 확장한다.

---

## 7. 다음 단계

이 설계 문서 승인 후 `writing-plans` 스킬로 구현 플랜을 작성한다. 구현 플랜은 다음 순서를 포함:

1. `css/tokens.css` 작성 및 검증
2. `css/typography.css` 작성 (utility classes)
3. `css/fonts.css` + 폰트 로딩 HTML snippet
4. `tokens/*.json` DTCG 스펙 생성
5. `preview/index.html` 시각 검증 페이지
6. `docs/*.md` 가이드 문서 작성

각 단계는 브라우저에서 실제 렌더링 결과를 확인하고 넘어간다.
