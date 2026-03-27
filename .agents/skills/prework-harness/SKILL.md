---
name: prework-harness
description: Use this skill for new ddokddok features, product ideas, workflow changes, or ambiguous build requests that should go through requirements clarification, design direction, and kickoff readiness before implementation.
---

# ddokddok Prework Harness

Use this skill when the user wants to start new work in `C:\study\ddokddok` but the scope is not implementation-ready yet.

Do not use this skill for:
- tiny copy edits
- obvious one-line fixes
- narrowly scoped bugs with a clear root cause
- requests where the user explicitly says to skip prework

## Goal

Turn a rough request into a small set of local artifacts that make implementation safer and faster.

## Output Rules

- Keep the conversation in Korean unless the user asks otherwise.
- Write specs into `docs/superpowers/specs`.
- Write implementation plans into `docs/superpowers/plans`.
- Reuse templates from `docs/superpowers/templates` when possible.
- Keep artifacts concise and decision-oriented.

## Workflow

### 1. Explore the local project context

- Read `AGENTS.md` first.
- Inspect `frontend` and `backend` only as much as needed to understand the current state.
- If the workspace is mostly empty, acknowledge that and treat the session as product-definition-first work.

### 2. Clarify requirements

Capture:
- problem statement
- target user
- main use case
- success criteria
- constraints
- non-goals
- open questions

Ask one clarifying question at a time only when a missing answer would change the scope or verdict.

Write the result to:

`docs/superpowers/specs/YYYY-MM-DD-<topic>-requirements.md`

Use `docs/superpowers/templates/requirements-spec-template.md` as the baseline structure.

### 3. Shape design direction

After requirements are clear enough:
- propose 2-3 approaches
- recommend one
- define the primary user flow
- identify MVP boundaries
- list major UX or product risks

Write the result to:

`docs/superpowers/specs/YYYY-MM-DD-<topic>-design-direction.md`

Use `docs/superpowers/templates/design-direction-template.md` as the baseline structure.

### 4. Run the kickoff gate

Decide one of:
- `Ready for implementation`
- `Needs more input`
- `Reduce scope first`

The verdict must include:
- short rationale
- blocker list if not ready
- next actions

Write the result to:

`docs/superpowers/specs/YYYY-MM-DD-<topic>-kickoff-readiness.md`

Use `docs/superpowers/templates/kickoff-readiness-template.md` as the baseline structure.

### 5. Handoff to implementation

Only after the user approves the prework outcome:
- create `docs/superpowers/plans/YYYY-MM-DD-<topic>-implementation-plan.md`
- keep the implementation boundary aligned with the kickoff verdict

## Working Style

- Prefer small, direct artifacts over long reports.
- Do not pretend uncertainty is resolved when it is not.
- Do not start coding during this skill unless the user explicitly changes the task.
- If you reference repository context, cite concrete file paths.
