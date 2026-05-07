# 타이포그래피 가이드

단테랩스 디자인 시스템 v1의 타이포 스케일 사용 가이드. 스펙 §3 참조.

## 2-Track 구조

| Track         | 대상                                           | 사용처                                                     |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| **Editorial** | YouTube 배너·썸네일, 모션그래픽, 아티클 히어로 | `hero`·`display`·`accent`·`sub`·`meta`                     |
| **UI**        | 홈페이지 UI/UX, 아티클 본문                    | `h1`–`h4`, `body-lg`·`body`·`body-sm`, `caption`, `button` |

## Font Stack

| 역할            | Primary          | CSS 변수                        |
| --------------- | ---------------- | ------------------------------- |
| Editorial 한글  | Nanum Myeongjo   | `--font-editorial-ko`           |
| Editorial Latin | Playfair Display | `--font-editorial-en`           |
| UI 헤딩·본문    | Noto Serif KR    | `--font-heading`, `--font-body` |
| 메타·버튼·캡션  | Pretendard       | `--font-sans`                   |
| 코드            | JetBrains Mono   | `--font-mono`                   |

## Editorial Scale

| 클래스          | 크기  | 행간 | Weight | 용도                                    |
| --------------- | ----- | ---- | ------ | --------------------------------------- |
| `.type-hero`    | 128px | 1.15 | 800    | 썸네일 결정적 키워드                    |
| `.type-display` | 96px  | 1.10 | 700    | 히어로 긴 문장                          |
| `.type-accent`  | 64px  | 1.20 | 700    | 부분 강조                               |
| `.type-sub`     | 32px  | 1.40 | 400    | 보조 설명, CTA URL                      |
| `.type-meta`    | 18px  | 1.50 | 500    | 서명·시즌 (UPPERCASE + tracking 0.16em) |

큰 스케일 필요 시: `transform: scale(1.5)` 또는 `clamp()` 사용. 토큰은 고정.

## UI Scale

| 클래스          | 크기 | 행간 | Weight | 폰트                               |
| --------------- | ---- | ---- | ------ | ---------------------------------- |
| `.type-h1`      | 56px | 1.20 | 700    | Serif                              |
| `.type-h2`      | 40px | 1.25 | 700    | Serif                              |
| `.type-h3`      | 28px | 1.30 | 600    | Serif                              |
| `.type-h4`      | 22px | 1.35 | 600    | Serif                              |
| `.type-body-lg` | 20px | 1.65 | 400    | Serif                              |
| `.type-body`    | 16px | 1.65 | 400    | Serif (**기본**)                   |
| `.type-body-sm` | 14px | 1.50 | 400    | Serif                              |
| `.type-caption` | 13px | 1.40 | 500    | Sans                               |
| `.type-button`  | 14px | 1.00 | 600    | Sans (UPPERCASE + tracking 0.04em) |

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

### `.num-tabular` modifier

`.num-tabular`는 `.type-*` 클래스와 조합해 사용하는 **modifier** 클래스입니다 (네이밍이 `type-` 접두어를 따르지 않는 이유). `font-family: var(--font-sans) + font-variant-numeric: tabular-nums`를 적용해 표·숫자 영역에서 자릿수가 맞는 고정폭 숫자를 제공합니다.

```html
<td class="type-body num-tabular">1,234,567</td>
```

### `font` 축약 토큰 주의사항

`.type-*` utility는 `font: var(--type-X)` CSS 축약 속성을 사용합니다. 이는 `font-style`, `font-variant`, `font-stretch`, `font-feature-settings`, `font-variation-settings`, `font-kerning` 등을 **초기값으로 리셋**합니다. OpenType 기능(`font-feature-settings: "ss01"` 등)이 필요한 경우 `.type-*` 적용 이후에 따로 선언해야 합니다.

## 사용 예

```html
<article>
  <h1 class="type-h1">AI를 오케스트레이트하라</h1>
  <p class="type-body-lg">질문하는 시대는 끝나가고 있다…</p>
  <p class="type-body">단테랩스는 AI 자동화와…</p>
  <time class="type-body-sm" style="color: var(--text-meta);"
    >2026년 4월 24일</time
  >
</article>
```

## 폰트 로딩

자세한 내용은 스펙 §3.4 및 `css/fonts.css` 참조.
