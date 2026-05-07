# Spacing

9스텝 spacing 스케일. 4의 배수 + 12px(편집 그리드 보조).

## 토큰

| 숫자 인덱스 | 값   | t-shirt 별칭 | 주 용도                           |
| ----------- | ---- | ------------ | --------------------------------- |
| `--space-1` | 4px  | `--space-xs` | 인라인 갭, 아이콘-라벨            |
| `--space-2` | 8px  | `--space-sm` | 컴포넌트 내부 패딩                |
| `--space-3` | 12px | —            | 카드 내부 행 갭                   |
| `--space-4` | 16px | `--space-md` | 카드 패딩 표준, 본문 단락 사이    |
| `--space-5` | 24px | —            | 섹션 내부 그룹 갭                 |
| `--space-6` | 32px | `--space-lg` | 섹션 사이 표준                    |
| `--space-7` | 48px | —            | 큰 섹션 분리                      |
| `--space-8` | 64px | `--space-xl` | hero 위/아래 패딩                 |
| `--space-9` | 96px | —            | hero/landing section divider 한정 |

## 사용 규칙

- 본문 단락 사이는 `--space-4`(16px) 표준
- 섹션 사이는 `--space-6`(32px) 표준, 큰 섹션은 `--space-7`(48px)
- `--space-9`(96px)는 hero·landing의 section divider에만
- 8의 배수가 아닌 12px(`--space-3`)는 카드 내부 행 갭에 한정

## 듀얼 네이밍

숫자 인덱스가 표준, t-shirt 별칭은 자주 쓰는 5개에만 alias 제공. 같은 값이면 어느 쪽을 써도 무방.
