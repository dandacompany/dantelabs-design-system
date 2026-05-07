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
