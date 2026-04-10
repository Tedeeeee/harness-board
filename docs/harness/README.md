# Harness Documentation

Harness Board의 구조와 운영 방식을 설명하는 문서 허브입니다.

이 레포를 처음 받았거나, 다른 사람에게 하네스를 설명해야 한다면 아래 순서로 읽는 것을 권장합니다.

1. [handoff.md](./handoff.md)
   전달용 요약 문서입니다. 이 하네스가 무엇인지, 어떤 폴더가 핵심인지, 현재 어디까지 standalone으로 동작하는지 빠르게 파악할 수 있습니다.

2. [overview.md](./overview.md)
   하네스가 왜 존재하는지, 어떤 문제를 해결하려는지, 어떤 철학 위에 설계되었는지를 설명합니다.

3. [architecture.md](./architecture.md)
   디렉터리 구조, Claude 진입점, skills/agents/hooks 연결 방식, 현재 MVP 범위를 설명합니다.

## Related Files

- [AGENTS.md](../../AGENTS.md)
  프로젝트 운영 원칙과 파이프라인 요약
- [CLAUDE.md](../../CLAUDE.md)
  Claude가 프로젝트에서 따라야 할 규칙

## Current Standalone MVP

현재 standalone으로 우선 지원하는 핵심 진입점은 아래 네 가지입니다.

- `/office-hours`
- `/blueprint`
- `/review`
- `/ship`

이 네 가지를 중심으로 요구사항 정제, 계획 수립, 검증, 출시 준비 흐름을 연결하는 것이 현재 MVP 범위입니다.
