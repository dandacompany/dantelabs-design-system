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
