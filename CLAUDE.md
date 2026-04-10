# Harness Board — Automated Development System

## Overview

요구사항 문서를 입력하면, 인간의 핵심 의사결정(계획 승인, 배포 승인)을 제외한 모든 개발 과정을 자동으로 수행하는 standalone 하네스 시스템.

이 레포 하나만으로 동작합니다. 외부 플러그인(ECC, gstack 등) 설치가 필요하지 않습니다.

## Pipeline

```
[요구사항 문서] → 정제 → 설계 → 구현 → 검증 → 출시
```

### Phase 1: 요구사항 정제 & 계획 (Plan)
1. `/office-hours` — 6가지 강제 질문으로 요구사항 구체화
2. `planner` agent — 요구사항 → 단계별 구현 계획 생성
3. `architect` agent — 시스템 아키텍처 설계 + 트레이드오프 분석
4. `/blueprint` — 1줄 목표 → 멀티스텝 실행 계획 (plans/ 디렉토리에 저장)
5. **[인간 확인]** — 계획 검토 및 승인

### Phase 2: 구현 (Build)
1. `code-architect` agent — 코드베이스 패턴 분석 → 구현 블루프린트
2. `loop-operator` agent — 자율 구현 루프 안전 관리
3. `build-error-resolver` agent — 빌드 에러 자동 해결

### Phase 3: 검증 (Verify)
1. `/review` — 시니어 엔지니어급 코드 리뷰 + 자동 수정
2. `code-reviewer` agent — 코드 품질/보안 리뷰
3. `security-reviewer` agent — OWASP Top 10 보안 감사

### Phase 4: 출시 (Ship)
1. **[인간 확인]** — 배포 승인
2. `/ship` — 테스트 → 리뷰 → 푸시 → PR 생성 원커맨드

## Skill Routing

아래 요청 패턴이 감지되면 해당 스킬을 자동으로 호출하세요:

| 요청 패턴 | 실행할 커맨드 | 스킬 파일 |
|-----------|-------------|----------|
| "요구사항 정리", "아이디어 검토", "이거 만들만 해?" | `/office-hours` | `skills/office-hours/SKILL.md` |
| "계획 세워줘", "블루프린트", "로드맵" | `/blueprint` | `skills/blueprint/SKILL.md` |
| "코드 리뷰", "PR 리뷰", "diff 확인" | `/review` | `skills/review/SKILL.md` |
| "출시", "배포", "PR 만들어", "ship" | `/ship` | `skills/ship/SKILL.md` |

## Project Structure

```
harness-board/
├── .claude/
│   ├── settings.json          # 프로젝트 설정 + hooks
│   └── commands/              # 슬래시 커맨드 엔트리포인트
│       ├── office-hours.md    # /office-hours
│       ├── blueprint.md       # /blueprint
│       ├── review.md          # /review
│       └── ship.md            # /ship
├── agents/                    # Claude Code agents
│   ├── planner.md             # 요구사항 → 구현 계획 (opus)
│   ├── architect.md           # 시스템 아키텍처 설계 (opus)
│   ├── code-architect.md      # 코드베이스 기반 블루프린트 (sonnet)
│   ├── loop-operator.md       # 자율 루프 안전 관리 (sonnet)
│   ├── code-reviewer.md       # 코드 리뷰 (sonnet)
│   ├── security-reviewer.md   # 보안 취약점 탐지 (sonnet)
│   ├── build-error-resolver.md # 빌드 에러 수정 (sonnet)
│   └── tdd-guide.md           # TDD 가이드 (sonnet)
├── skills/                    # 스킬 상세 지침
│   ├── office-hours/SKILL.md
│   ├── blueprint/SKILL.md
│   ├── review/SKILL.md
│   ├── ship/SKILL.md
│   └── ...                    # 추가 스킬 (후순위)
├── hooks/
│   └── config-protection.js   # linter/formatter 설정 보호
└── CLAUDE.md                  # 이 파일
```

## Hooks

`.claude/settings.json`에 정의된 자동화 훅:

| Hook | 동작 |
|------|------|
| `pre:bash:block-no-verify` | git hook bypass (--no-verify) 차단 |
| `pre:write:config-protection` | linter/formatter 설정 파일 수정 차단 |

## Agents (agents/)

| Agent | Model | Role |
|-------|-------|------|
| `planner` | opus | 요구사항 → 구현 계획 |
| `architect` | opus | 시스템 아키텍처 설계 |
| `code-architect` | sonnet | 코드베이스 기반 구현 블루프린트 |
| `loop-operator` | sonnet | 자율 루프 안전 관리 |
| `code-reviewer` | sonnet | 코드 리뷰 |
| `security-reviewer` | sonnet | 보안 취약점 탐지 |
| `build-error-resolver` | sonnet | 빌드 에러 최소 변경 수정 |
| `tdd-guide` | sonnet | TDD 방법론 가이드 |

## Usage

### 기본 사용법
```
요구사항 문서를 제공하면, 이 하네스가 자동으로:
1. 요구사항을 분석하고 계획을 수립합니다
2. 계획 승인 후 자율적으로 구현합니다
3. 검증 루프를 통해 품질을 보장합니다
4. 배포 승인 후 PR을 생성합니다
```

### 인간 개입 지점 (2곳만)
1. **계획 승인** — Phase 1 완료 후
2. **배포 승인** — Phase 3 완료 후

## Principles

1. **요구사항 먼저** — 코딩 전에 반드시 요구사항 정제
2. **테스트 먼저** — TDD로 구현, 80%+ 커버리지
3. **최소 변경** — 빌드 에러는 최소 diff로 수정
4. **자동 검증** — 검증 루프 필수 통과
5. **안전한 루프** — 실패 감지 시 자동 에스컬레이션
6. **Standalone** — 외부 의존성 없이 이 레포만으로 동작
