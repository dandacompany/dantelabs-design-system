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
