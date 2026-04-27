# Figma 라이브러리 구축 계획 (v2)

**상태**: v1에서는 범위 외. v2 이후 작업의 출발점.

## 전략

1. **CSS·JSON 토큰을 Figma Variables로 import**
   - Tokens Studio plugin 사용
   - DTCG JSON(`tokens/*.json`)을 직접 로드
   - 단방향: 코드가 source of truth, Figma는 반영만

2. **모드 구성**
   - `Light` (현재 v1)
   - `Dark` (v2에서 추가)

3. **스타일 vs 변수 분리**
   - 컬러·타이포: **Variables**
   - Shadow·blur·radius: v2 토큰화 후 Styles

## 라이브러리 파일 구조 (계획)

- Tokens: Colors Variables (Light+Dark), Typography Variables
- Foundations: Text Styles, Color Styles
- Components (v2): Button, Card 등
- Templates: YouTube Banner, YouTube Thumbnail, Article Hero

## 마일스톤

- [ ] M1: Tokens Studio plugin 세팅, color.json import
- [ ] M2: typography.json import, Text Styles 생성
- [ ] M3: Light + Dark 모드 구성
- [ ] M4: YouTube / Article 템플릿 파일 생성
- [ ] M5: Components 라이브러리화

## 참고

- Tokens Studio · https://tokens.studio
- DTCG draft · https://tr.designtokens.org/format/
- v1 토큰: `../tokens/color.json`, `../tokens/typography.json`
