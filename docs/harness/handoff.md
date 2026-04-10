# Harness Handoff

## What This Is

Harness Board는 요구사항 문서를 입력으로 받아, 계획 수립부터 구현, 검증, 출시 준비까지 Claude가 구조적으로 수행할 수 있도록 만든 standalone 하네스입니다.

이 하네스의 목적은 단순히 프롬프트를 모아두는 것이 아니라, Claude가 프로젝트 안에서 일관된 절차와 역할 분리를 따라 움직이게 만드는 것입니다.

핵심 개념은 간단합니다.

- 사람은 중요한 승인 지점만 담당합니다.
- Claude는 정해진 진입점과 규칙에 따라 나머지 작업을 수행합니다.
- 문서, skills, agents, hooks가 서로 연결되어 하나의 운영 시스템처럼 동작합니다.

## What It Automates

Harness Board는 아래 흐름을 자동화하는 것을 목표로 합니다.

```text
[요구사항 문서]
   -> /office-hours
   -> 요구사항 정제
   -> /blueprint
   -> 구현 계획 수립
   -> 구현
   -> /review
   -> 검증 및 리스크 확인
   -> /ship
   -> 출시/PR 준비
```

사람이 직접 판단하는 핵심 지점은 두 곳입니다.

- 계획 승인
- 배포 승인

## Current Standalone Scope

현재 standalone MVP에서 우선 지원하는 범위는 아래 네 가지입니다.

- `/office-hours`
- `/blueprint`
- `/review`
- `/ship`

이 네 가지는 현재 레포 구조만으로 연결되는 최소 실행 단위입니다.

그 외 skills도 레포 안에 포함되어 있지만, 모두가 동일한 수준으로 정리되었다고 가정하면 안 됩니다. handoff 시에는 위 네 가지를 기준으로 설명하는 것이 가장 안전합니다.

## Core Directories

하네스를 설명할 때는 아래 다섯 영역만 이해하면 됩니다.

### 1. `.claude/commands`

Claude가 직접 인식하는 진입점입니다.

- `office-hours.md`
- `blueprint.md`
- `review.md`
- `ship.md`

즉 사용자는 slash command를 통해 하네스를 시작합니다.

### 2. `skills/`

각 command가 실제로 따라야 하는 상세 지침입니다.

예를 들어 `/blueprint`는 결국 `skills/blueprint/SKILL.md`의 절차를 바탕으로 계획을 만들고, `/review`는 `skills/review/SKILL.md`의 흐름을 따릅니다.

이 디렉터리는 하네스의 실질적인 작업 원문에 가깝습니다.

### 3. `agents/`

작업을 역할 단위로 나누기 위한 정의입니다.

예를 들면:

- `planner`
- `architect`
- `code-reviewer`
- `security-reviewer`
- `loop-operator`

이 파일들은 “어떤 역할이 어떤 책임을 가져야 하는가”를 분리해주는 계층입니다.

### 4. `hooks/`

위험한 작업을 자동으로 막거나 규칙을 지키도록 돕는 안전장치입니다.

현재 MVP에서는 `config-protection.js`를 통해 lint/format/type 관련 설정 파일을 함부로 약화시키는 수정을 막는 역할이 포함되어 있습니다.

### 5. `docs/harness/`

하네스 자체를 설명하는 문서들입니다.

- `README.md` : 문서 입구
- `overview.md` : 왜 존재하는지
- `architecture.md` : 구조와 흐름
- `handoff.md` : 지금 읽고 있는 전달용 문서

## Minimal Mental Model

이 하네스를 가장 짧게 설명하면 아래와 같습니다.

```text
commands = 진입점
skills   = 실제 작업 절차
agents   = 역할 분리
hooks    = 안전장치
docs     = 설명 문서
```

즉 Claude가 command로 들어오고, skill을 따라 일하고, 필요하면 agent 관점으로 역할을 나누고, hook이 위험한 동작을 막아주는 구조입니다.

## Recommended Explanation When Sharing

다른 사람에게 설명할 때는 아래 정도로 말하면 충분합니다.

> 요구사항 문서를 넣으면 Claude가 요구사항 정제, 계획 수립, 검증, 출시 준비까지 구조적으로 따라가도록 만든 standalone 하네스입니다.  
> 현재는 `/office-hours`, `/blueprint`, `/review`, `/ship` 네 가지 흐름을 중심으로 동작하도록 정리되어 있습니다.

## What To Share

하네스를 따로 전달할 때는 아래만 포함하면 됩니다.

- `.claude/`
- `agents/`
- `skills/`
- `hooks/`
- `docs/harness/`
- `AGENTS.md`
- `CLAUDE.md`

반대로 아래는 하네스 설명용 전달본에서는 제외해도 됩니다.

- `.git/`
- `node_modules/`
- 결과물 프로젝트용 `frontend/`, `backend/`
- 테스트 산출물이나 로그 파일

## Caveats

- 현재 standalone MVP 설명은 `/office-hours`, `/blueprint`, `/review`, `/ship` 기준으로 이해하는 것이 좋습니다.
- 하네스는 계속 다듬을 수 있으므로, 외부에 전달할 때는 결과물 설명과 하네스 설명을 분리하는 편이 좋습니다.
- 즉, 결과물은 결과물 zip으로 먼저 보여주고, 하네스는 필요할 때 이 문서와 함께 따로 전달하는 방식이 가장 이해가 쉽습니다.
