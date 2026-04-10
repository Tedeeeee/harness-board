# Harness Architecture

## Repository Structure

```text
harness-board/
├── .claude/
│   ├── settings.json
│   └── commands/
│       ├── office-hours.md
│       ├── blueprint.md
│       ├── review.md
│       └── ship.md
├── agents/
│   ├── planner.md
│   ├── architect.md
│   ├── code-architect.md
│   ├── loop-operator.md
│   ├── code-reviewer.md
│   ├── security-reviewer.md
│   ├── build-error-resolver.md
│   └── tdd-guide.md
├── skills/
│   ├── office-hours/
│   ├── blueprint/
│   ├── review/
│   ├── ship/
│   └── ...
├── hooks/
│   └── config-protection.js
├── docs/
│   └── harness/
│       ├── README.md
│       ├── overview.md
│       └── architecture.md
├── AGENTS.md
└── CLAUDE.md
```

## How It Works

Harness Board의 기본 흐름은 아래와 같습니다.

```text
[요구사항 문서]
   ↓
/office-hours
   ↓
요구사항 정제
   ↓
/blueprint
   ↓
실행 계획 수립
   ↓
구현
   ↓
/review
   ↓
검증 및 품질 확인
   ↓
/ship
   ↓
출시/PR 준비
```

이 흐름 안에서 인간은 모든 세부 구현을 직접 지시하지 않습니다.
대신 아래 두 지점에서만 핵심 판단을 내립니다.

- 계획 승인
- 배포 승인

즉, Harness Board는 "사람이 세세하게 시키는 방식"이 아니라, "사람은 방향과 승인에 집중하고 Claude는 구조화된 실행을 맡는 방식"을 지향합니다.

## Execution Layers

### 1. `.claude/commands`

Claude가 직접 인식하는 진입점입니다.
사용자는 이 레이어를 통해 `/office-hours`, `/blueprint`, `/review`, `/ship`를 호출합니다.

### 2. `skills/`

각 커맨드가 실제로 따라야 하는 상세 지침입니다.
명령의 의미와 절차는 여기서 정의됩니다.

### 3. `agents/`

복잡한 판단을 역할 단위로 분리하기 위한 정의입니다.
planner, architect, reviewer처럼 역할별 책임을 명확히 나눕니다.

### 4. `hooks/`

위험한 수정이나 규칙 위반을 막기 위한 자동 안전장치입니다.
현재 MVP에서는 설정 파일 보호 같은 최소 보호만 우선 적용합니다.

## MVP Scope

현재 standalone MVP에서 우선 지원하는 범위는 다음 네 가지입니다.

- `/office-hours`
- `/blueprint`
- `/review`
- `/ship`

이 네 커맨드는 이 레포 안의 구조만으로 동작하는 최소 실행 단위입니다.

그 외 스킬이나 확장 기능은 후속적으로 정리될 수 있으며, 모든 기능이 동일한 수준으로 독립화되어 있다고 가정하지 않는 것이 좋습니다.
