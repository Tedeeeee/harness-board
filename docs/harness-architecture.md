# Harness Board 아키텍처 상세 가이드

## 개요

Harness Board는 **Claude Code 기반 자동화 개발 시스템**입니다. 요구사항 문서를 입력하면, 인간의 핵심 의사결정(계획 승인, 배포 승인) 2곳을 제외한 모든 개발 과정을 자동으로 수행합니다.

외부 플러그인 없이 이 레포 하나만으로 동작합니다.

---

## 전체 파이프라인

```
[요구사항 문서]
     │
     ▼
┌─────────────────────────────────────┐
│  Phase 1: 계획 (Plan)                │
│                                     │
│  /office-hours  → 요구사항 정제      │
│  planner agent  → 구현 계획 생성     │
│  architect agent → 아키텍처 설계     │
│  /blueprint     → 멀티스텝 실행 계획  │
│                                     │
│  ──── 🔒 인간 확인: 계획 승인 ────   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Phase 2: 구현 (Build)               │
│                                     │
│  code-architect agent → 코드 블루프린트│
│  loop-operator agent  → 자율 루프 관리 │
│  build-error-resolver → 빌드에러 해결  │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Phase 3: 검증 (Verify)              │
│                                     │
│  /review           → 코드 리뷰       │
│  code-reviewer     → 품질/보안 리뷰   │
│  security-reviewer → OWASP 감사       │
│                                     │
│  ──── 🔒 인간 확인: 배포 승인 ────   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Phase 4: 출시 (Ship)                │
│                                     │
│  /ship → 테스트→리뷰→버전→커밋→PR    │
└─────────────────────────────────────┘
```

---

## 디렉토리 구조

```
harness-board/
├── .claude/
│   ├── settings.json          # 프로젝트 설정 + 자동화 훅
│   ├── settings.local.json    # 로컬 권한 허용 목록
│   └── commands/              # 슬래시 커맨드 → 스킬 라우팅
│       ├── office-hours.md
│       ├── blueprint.md
│       ├── review.md
│       └── ship.md
│
├── agents/                    # 전문 에이전트 8개
│   ├── planner.md
│   ├── architect.md
│   ├── code-architect.md
│   ├── loop-operator.md
│   ├── code-reviewer.md
│   ├── security-reviewer.md
│   ├── build-error-resolver.md
│   └── tdd-guide.md
│
├── skills/                    # 실행 가능한 워크플로우
│   ├── office-hours/SKILL.md
│   ├── blueprint/SKILL.md
│   ├── review/SKILL.md
│   ├── ship/SKILL.md
│   ├── qa/SKILL.md
│   ├── plan-eng-review/SKILL.md
│   ├── verification-loop/SKILL.md
│   ├── tdd-workflow/SKILL.md
│   ├── git-workflow/SKILL.md
│   ├── investigate/SKILL.md
│   └── autoplan/SKILL.md
│
├── hooks/
│   └── config-protection.js   # linter/formatter 설정 보호 훅
│
├── CLAUDE.md                  # 시스템 전체 지침
└── AGENTS.md                  # 빠른 시작 가이드
```

---

## 구성 요소 상세

### 1. 설정 (.claude/)

#### settings.json — 자동화 훅

| 훅 | 타이밍 | 동작 |
|----|--------|------|
| `block-no-verify` | pre:bash | `--no-verify` 플래그 감지 시 git 명령 차단 |
| `config-protection` | pre:write | linter/formatter 설정 파일 수정 차단 |

**보호 대상 파일:** `.eslintrc`, `.prettierrc`, `biome.json`, `tsconfig.json` 등

**설계 의도:** 에이전트가 린터 규칙을 우회하는 대신 코드를 수정하도록 유도

#### settings.local.json — 권한 허용 목록

Bash 명령의 자동 허용 범위를 정의합니다:
- Git 작업 (remote, auth, status)
- 패키지 관리 (npm, node, vite)
- 서버 실행 (localhost:3000 등)
- 테스트/검증 (vitest, prisma)

#### commands/ — 슬래시 커맨드 라우팅

각 `.md` 파일은 해당 스킬의 진입점:

```
/office-hours → skills/office-hours/SKILL.md 실행
/blueprint    → skills/blueprint/SKILL.md 실행
/review       → skills/review/SKILL.md 실행
/ship         → skills/ship/SKILL.md 실행
```

---

### 2. 에이전트 (agents/)

에이전트는 특정 역할에 특화된 AI 전문가입니다. 각각 모델 티어, 도구 접근 권한, 호출 조건이 정의되어 있습니다.

| 에이전트 | 모델 | 역할 | 언제 호출되나 |
|---------|------|------|-------------|
| **planner** | Opus | 요구사항 → 구현 계획 | 기능 요청, 아키텍처 변경, 복잡한 리팩토링 |
| **architect** | Opus | 시스템 아키텍처 설계 | 확장성, 기술 트레이드오프 결정 |
| **code-architect** | Sonnet | 코드베이스 패턴 → 구현 블루프린트 | 기존 패턴 분석, 구현 설계 |
| **loop-operator** | Sonnet | 자율 구현 루프 안전 관리 | 멀티스텝 자율 워크플로우 |
| **code-reviewer** | Sonnet | 코드 품질/보안 리뷰 | 코드 랜딩 전 품질 보증 |
| **security-reviewer** | Sonnet | OWASP Top 10 보안 감사 | 보안 집중 리뷰 |
| **build-error-resolver** | Sonnet | 빌드 에러 최소 변경 수정 | 빌드 실패, 타입 에러 |
| **tdd-guide** | Sonnet | TDD 방법론 가이드 | 테스트 우선 개발 |

#### 모델 선택 기준

- **Opus (최강):** 복잡한 추론이 필요한 작업 — 계획 수립, 아키텍처 설계
- **Sonnet (빠름):** 실행 중심 작업 — 코드 작성, 리뷰, 에러 수정

#### 에이전트 동작 예시: build-error-resolver

```
입력: TypeScript 빌드 에러 발생
동작:
  1. 에러 메시지 분석
  2. 최소 변경 전략 결정 (리팩토링 금지!)
  3. 타입 어노테이션, 옵셔널 체이닝, 임포트 경로 등 수정
  4. 빌드 재실행으로 검증
원칙: 가장 작은 diff로 해결
```

#### 에이전트 동작 예시: loop-operator

```
입력: 자율 구현 루프 시작
동작:
  1. 진행 체크포인트 추적
  2. 정체 감지 (같은 에러 반복)
  3. 재시도 폭풍 방지
  4. 실패 시 범위 축소
  5. 해결 불가 시 인간에게 에스컬레이션
원칙: 안전한 자율 실행
```

---

### 3. 스킬 (skills/)

스킬은 **실행 가능한 상세 워크플로우**입니다. 에이전트가 "누구"라면, 스킬은 "어떻게"입니다.

#### 핵심 스킬 4개 (파이프라인)

##### /office-hours — 요구사항 정제
```
목적: 코딩 전에 문제를 제대로 이해하기
모드:
  - Startup 모드: YC 스타일 6가지 강제 질문
    Q1. 수요 현실 (진짜 원하는 사람이 있나?)
    Q2. 현재 상황 (지금은 어떻게 해결하나?)
    Q3. 구체적 대상 (누가 가장 필요로 하나?)
    Q4. 최소 웻지 (이번 주 돈 내고 쓸 최소 버전?)
    Q5. 관찰과 놀라움 (사용자를 직접 봤나?)
    Q6. 미래 적합성 (3년 후에도 필요한가?)
  - Builder 모드: 설계 파트너 브레인스토밍

추가 단계:
  - Landscape Search: 기존 접근법 조사
  - Premise Challenge: 전제 검증
  - Second Opinion: 독립 AI 서브에이전트 검토
  - Alternatives: 2-3개 구현 접근법 제시
  - Wireframe: UI가 있으면 스케치 생성

출력: docs/designs/ 에 디자인 문서 저장
규칙: 절대 코드 작성 금지, 설계 문서만 출력
```

##### /blueprint — 구현 계획
```
목적: 1줄 목표 → 멀티스텝 실행 계획
5단계 파이프라인:
  1. Research: 사전 점검 (git, gh, 프로젝트 구조)
  2. Design: 1-PR 크기 스텝으로 분해 (3-12개)
  3. Draft: plans/ 에 마크다운 작성
  4. Review: 적대적 리뷰 게이트
  5. Register: 플랜 저장, 메모리 업데이트

특징:
  - Cold-start 실행: 각 스텝이 독립적 (이전 스텝 안 읽어도 됨)
  - 의존성 그래프: 병렬 가능 스텝 자동 감지
  - 모델 티어: 복잡한 스텝은 Opus, 실행은 Sonnet
  - 롤백 전략: 스텝별 복구 방법 포함

출력: plans/{name}.md
```

##### /review — 코드 리뷰
```
목적: 랜딩 전 구조적 문제 감지
검사 항목:
  - SQL 안전성, 신뢰 경계 위반, 조건부 사이드이펙트
  - 스코프 드리프트 감지 (요청한 것 vs 만든 것)
  - 플랜 완료 감사 (blueprint가 있으면)
  - 보안 (하드코딩된 비밀, XSS, 인젝션)
  - 성능 (N+1 쿼리, 메모리, 캐싱)

특징:
  - 플랫폼 자동 감지 (GitHub/GitLab)
  - 플랜 파일과 대조해서 누락된 항목 플래그
```

##### /ship — 자동 출시
```
목적: 테스트 → 리뷰 → 커밋 → PR 원커맨드
완전 비대화형: /ship 입력 후 자동 실행

워크플로우:
  1. 사전 점검
  2. 베이스 브랜치 머지
  3. 테스트 실행 + 커버리지 감사
  4. AI 커버리지 갭 테스트 생성
  5. 플랜 완료 검증
  6. 버전 범프 결정
  7. CHANGELOG 업데이트
  8. 커밋 + 푸시
  9. PR 생성/업데이트
  10. 베이스 브랜치 머지

자동 버전: MICRO/PATCH는 자동, MINOR/MAJOR는 물어봄
```

#### 보조 스킬 7개

| 스킬 | 목적 |
|------|------|
| **qa** | 체계적 QA 테스트 + 버그 수정. 심각도별 티어(Quick/Standard/Exhaustive), 건강 점수 산출 |
| **plan-eng-review** | 엔지니어링 매니저급 플랜 리뷰. 아키텍처/코드 품질/테스트/성능 4섹션 순차 검토 |
| **verification-loop** | 빌드→타입체크→린트→테스트(80%+)→보안스캔→diff 리뷰 6단계 검증 |
| **tdd-workflow** | RED→GREEN→REFACTOR 사이클 강제. 각 단계별 git 체크포인트 |
| **git-workflow** | 브랜칭 전략, 커밋 컨벤션, PR 워크플로우 가이드 |
| **investigate** | 체계적 디버깅. 근본 원인 분석 없이 수정 금지 원칙 |
| **autoplan** | 자동 계획 수립 (blueprint의 자동화 버전) |

---

### 4. 훅 (hooks/)

#### config-protection.js

```javascript
// 동작 원리:
// 1. Claude Code가 파일 수정 시도
// 2. settings.json의 pre:write 훅이 이 스크립트 호출
// 3. 대상 파일이 보호 목록에 있으면 exit(2)로 차단
// 4. Claude는 설정을 바꾸는 대신 코드를 수정하게 됨

보호 대상:
  .eslintrc, .eslintignore, .eslintrc.*
  .prettierrc, .prettierignore, .prettierrc.*
  biome.json, biome.jsonc
  .stylelintrc, .stylelintrc.*
  tsconfig.json, tsconfig.*.json
```

**왜 필요한가:** AI가 린트 에러를 만나면 코드를 고치는 대신 린트 규칙을 비활성화하려는 경향이 있음. 이 훅이 그 경로를 차단하여 올바른 해결을 유도.

---

## 스킬 라우팅 테이블

사용자가 특정 패턴의 요청을 하면 자동으로 해당 스킬이 호출됩니다:

| 사용자 요청 패턴 | 실행되는 커맨드 |
|----------------|---------------|
| "요구사항 정리", "아이디어 검토", "이거 만들만 해?" | `/office-hours` |
| "계획 세워줘", "블루프린트", "로드맵" | `/blueprint` |
| "코드 리뷰", "PR 리뷰", "diff 확인" | `/review` |
| "출시", "배포", "PR 만들어", "ship" | `/ship` |

---

## 핵심 설계 원칙

| # | 원칙 | 설명 |
|---|------|------|
| 1 | **요구사항 먼저** | 코딩 전에 반드시 요구사항 정제 (/office-hours) |
| 2 | **테스트 먼저** | TDD로 구현, 80%+ 커버리지 |
| 3 | **최소 변경** | 빌드 에러는 최소 diff로 수정 |
| 4 | **자동 검증** | 검증 루프 필수 통과 |
| 5 | **안전한 루프** | 실패 감지 시 자동 에스컬레이션 |
| 6 | **Standalone** | 외부 의존성 없이 이 레포만으로 동작 |
| 7 | **인간 2곳만** | 계획 승인 + 배포 승인에서만 사람 개입 |

---

## 실제 사용 흐름 예시

이 레포에서 실제로 진행된 별소프트 홈페이지 구축 과정:

```
1. 사용자: 요구사항 문서 제공 (별소프트홈페이지요구사항.md)

2. /office-hours 실행
   → 6가지 질문으로 요구사항 진단
   → "수요 근거가 내부 판단" 발견
   → "자유게시판은 FDE 과정 요건" 확인
   → 세컨드 오피니언 서브에이전트 검토
   → 3가지 접근법 제시 → Approach B 선택
   → 와이어프레임 스케치 생성
   → 디자인 문서 작성 → 적대적 리뷰 3라운드 → 승인
   ✅ 출력: docs/designs/gksmf-main-design-*.md

3. 🔒 인간 확인: "계획 승인"

4. /blueprint 실행
   → 디자인 문서 기반 8스텝 구현 계획 생성
   → 의존성 그래프 + 병렬 가능 스텝 감지
   → 적대적 리뷰 게이트 통과
   ✅ 출력: plans/declarative-sprouting-kay.md

5. 🔒 인간 확인: "플랜 승인"

6. 자동 구현 (8스텝)
   → Step 1: 프로젝트 스캐폴드
   → Step 2+3: 병렬 (Prisma DB + 프론트 쉘)
   → Step 4+5: 병렬 (About 페이지 + API 엔드포인트)
   → Step 6: 게시판 목록/상세
   → Step 7: 게시판 작성/수정
   → Step 8: 마무리 + 폴리시
   ✅ 출력: 동작하는 풀스택 앱
```

---

## 새 프로젝트에 적용하기

1. 이 레포를 클론하거나 포크
2. 기존 앱 코드 삭제 (frontend/, backend/)
3. 요구사항 문서를 레포 루트에 배치
4. Claude Code에서 `/office-hours 요구사항파일.md` 실행
5. 파이프라인을 따라 진행

하네스 구조 자체(`.claude/`, `agents/`, `skills/`, `hooks/`)는 수정하지 않아도 어떤 프로젝트에든 그대로 사용 가능합니다.
