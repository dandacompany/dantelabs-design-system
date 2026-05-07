# 사용 규칙

단테랩스 디자인 시스템 v1의 컬러·타이포 조합 규칙. 스펙 §2.5 · §3.5 종합.

## 60/30/10 컬러 분배

| 비율    | 역할        | 토큰                             |
| ------- | ----------- | -------------------------------- |
| **60%** | 배경        | `paper`                          |
| **30%** | 본문·텍스트 | `ink`, `ink-soft`                |
| **10%** | 액센트      | `rust`, `slate`, `mark`, `amber` |

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
.article-body {
  color: var(--text-primary);
  background: var(--bg-canvas);
}
.cta-link {
  color: var(--text-link); /* = link-strong */
}
.hero-word {
  color: var(--accent-brand); /* = rust */
  font: var(--type-hero);
}
```

### ✗ DON'T

```css
/* 본문 링크를 link(약한 대비)로 사용 금지 */
.body-link {
  color: var(--color-link);
  font-size: 16px;
}

/* 본문을 Pretendard sans로 치환 금지 */
.article-body {
  font-family: var(--font-sans);
}
```
