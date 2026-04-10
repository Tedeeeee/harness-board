# Harness Board

요구사항 문서를 입력하면 자동으로 개발하는 Claude Code 하네스 시스템.

## Quick Start

1. 이 레포를 클론합니다
2. Claude Code에서 프로젝트 디렉토리를 엽니다
3. 슬래시 커맨드를 사용합니다:
   - `/office-hours` — 요구사항 정제
   - `/blueprint` — 구현 계획 생성
   - `/review` — 코드 리뷰
   - `/ship` — PR 생성 및 출시

외부 플러그인 설치가 필요 없습니다. 이 레포만으로 동작합니다.

## Structure

```
.claude/
  settings.json        → 프로젝트 설정 + hooks (엔트리포인트)
  commands/            → 슬래시 커맨드 (/office-hours, /blueprint, /review, /ship)
agents/                → 8개 전문 에이전트 (planner, architect, code-reviewer 등)
skills/                → 스킬 상세 지침 (SKILL.md 파일들)
hooks/                 → 로컬 hook 스크립트
```

## Pipeline

```
[요구사항] → /office-hours → /blueprint → 구현 → /review → /ship → PR
                                ↑                           ↑
                           [인간 승인]                  [인간 승인]
```

## Agents

| Agent | Model | 역할 |
|-------|-------|------|
| planner | opus | 요구사항 → 구현 계획 |
| architect | opus | 시스템 아키텍처 설계 |
| code-architect | sonnet | 코드베이스 기반 블루프린트 |
| loop-operator | sonnet | 자율 루프 안전 관리 |
| code-reviewer | sonnet | 코드 리뷰 |
| security-reviewer | sonnet | OWASP Top 10 보안 감사 |
| build-error-resolver | sonnet | 빌드 에러 최소 diff 수정 |
| tdd-guide | sonnet | TDD 방법론 가이드 |

## Requirements

- Claude Code CLI 또는 IDE 확장
- Git
- Node.js (hooks 실행용)
