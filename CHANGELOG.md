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
