# ddokddok Prework Harness Design

## Goal

Set up a repo-scoped Codex harness that works only inside `C:\study\ddokddok` and helps new work move through a prework phase before implementation starts.

## Constraints

- Do not modify Notion.
- Assume only one model is available, so every role runs on Codex with the same base model.
- Keep the harness local to this workspace.
- Support a workspace that is not yet a Git repository.

## Chosen Approach

Use a repo-scoped Codex setup with four layers:

1. `AGENTS.md` in the workspace root to establish project rules.
2. `.codex/config.toml` for project-scoped Codex defaults.
3. `.codex/agents/*.toml` for custom role agents.
4. `.agents/skills/prework-harness/` for the reusable prework workflow.

This follows current Codex repository conventions:

- Project guidance is loaded from `AGENTS.md`.
- Project config can live in `.codex/config.toml`.
- Custom agents live in `.codex/agents`.
- Repo-scoped skills are discovered from `.agents/skills`.

## Harness Flow

The harness supports one entry flow:

1. Requirements clarification
2. Design direction
3. Kickoff readiness gate
4. Implementation plan handoff

The main entry point is `prework_orchestrator`.

Supporting agents:

- `requirements_organizer`
- `design_direction_organizer`
- `kickoff_gatekeeper`

## Output Locations

Prework artifacts are stored locally in:

- `docs/superpowers/specs`
- `docs/superpowers/plans`
- `docs/superpowers/templates`

This keeps the workflow inspectable even if Codex does not auto-create files in a given session.

## Behavior Rules

- New feature or product-direction work should go through prework before implementation.
- Bug fixes or tiny deterministic edits can skip the harness unless the user asks otherwise.
- The harness stays in Korean by default.
- The harness should not require Git history because the workspace currently has no `.git` root.

## Assumptions

- Codex will be launched from `C:\study\ddokddok` or one of its subfolders.
- Project-scoped skills and instructions will be discovered from the workspace root.
- If project config trust is required by Codex, the user can trust this workspace once without changing the harness files.

## Risks

- If Codex is launched outside this folder, repo-scoped discovery may not load these files.
- If project trust is not enabled, `.codex/config.toml` may not be applied even though the files are present.
- Because all roles share one model, role separation depends on instructions rather than model diversity.

## Implementation Summary

Create:

- `AGENTS.md`
- `.codex/config.toml`
- `.codex/agents/prework_orchestrator.toml`
- `.codex/agents/requirements_organizer.toml`
- `.codex/agents/design_direction_organizer.toml`
- `.codex/agents/kickoff_gatekeeper.toml`
- `.agents/skills/prework-harness/SKILL.md`
- `.agents/skills/prework-harness/agents/openai.yaml`
- template files under `docs/superpowers/templates`

## Notes

This workspace is not a Git repository right now, so the brainstorming skill's "commit the design doc" step cannot be completed yet. The design file is still written locally so the workflow remains documented.
