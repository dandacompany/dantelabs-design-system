# 단테랩스 디자인 시스템 v1

단테랩스의 통합 브랜드 디자인 시스템. 컬러 토큰 14개와 타이포 스케일 Editorial 5단 / UI 9단으로 구성.

**설계 스펙**: [2026-04-24-dantelabs-design-system-design.md](superpowers/specs/2026-04-24-dantelabs-design-system-design.md)

## 적용 대상

| 트랙      | 대상 카테고리                                                       |
| --------- | ------------------------------------------------------------------- |
| Editorial | YouTube 배너, YouTube 영상·썸네일, 브랜드 모션그래픽, 아티클 히어로 |
| UI        | 홈페이지 UI/UX, 아티클 본문, 폼·테이블·카드                         |

## 설치 · 사용

### HTML에서 바로 사용

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
/>
<link
  rel="stylesheet"
  as="style"
  crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
/>

<link rel="stylesheet" href="css/tokens.css" />
<link rel="stylesheet" href="css/typography.css" />
```

### 사용 예

```html
<h1 class="type-h1">AI를 오케스트레이트하라</h1>
<p class="type-body">단테랩스는 AI 자동화와 에이전틱 데이터 사이언스를…</p>
<button
  class="type-button"
  style="background: var(--accent-alt); color: var(--bg-canvas); border:0; padding:12px 24px;"
>
  시작하기 →
</button>
```

## 문서

- [color.md](color.md) · 컬러 토큰 전체·명암비
- [typography.md](typography.md) · 타이포 스케일·사용 예
- [spacing.md](spacing.md) · 9스텝 spacing
- [radius.md](radius.md) · 5개 radius
- [shadow.md](shadow.md) · editorial emboss shadow
- [motion.md](motion.md) · editorial paper motion
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

## v2 이후 (현 버전 v1.1.0에서 진행)

- ✅ Spacing / radius / shadow / motion 토큰 (v1.1.0)
- 컴포넌트 라이브러리
- Dark mode 매핑
- Figma 라이브러리 ([figma/library-plan.md](../figma/library-plan.md))

## 테스트

```bash
npm install
npm test
```

범위: WCAG 명암비 · CSS ↔ JSON 일관성 · 필수 토큰 존재.
