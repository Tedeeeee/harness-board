# ddokddok Project Instructions

## Scope

These instructions apply to everything under `C:\study\ddokddok`.

## Prework-First Rule

- For new features, product ideas, workflow changes, UI redesigns, and ambiguous build requests, start with the repo skill `prework-harness` before implementation.
- The prework flow is:
  1. requirements clarification
  2. design direction
  3. kickoff readiness gate
- Do not start production implementation until the user approves the prework output or explicitly asks to skip the prework stage.

## Output Locations

- Save prework specs in `docs/superpowers/specs`.
- Save implementation plans in `docs/superpowers/plans`.
- Use the templates in `docs/superpowers/templates` whenever they fit the task.

## Local Custom Agents

- `prework_orchestrator`: entry point for the whole prework sequence.
- `requirements_organizer`: clarifies scope, actors, constraints, and acceptance criteria.
- `design_direction_organizer`: turns approved scope into user flows, IA, and MVP shape.
- `kickoff_gatekeeper`: decides whether the work is ready to implement and lists blockers if not.

## Repository Notes

- This workspace is currently not a Git repository. Do not require Git history or commit-based workflows unless a `.git` directory is added later.
- `frontend` and `backend` both belong to the same project space. Keep prework repo-wide unless the user narrows the target area.
- Keep the working language in Korean unless the user asks for English output.

## Practical Defaults

- Prefer asking one clarifying question at a time when the request is under-specified.
- Prefer concise artifacts over long essays.
- If the user clearly wants implementation immediately, confirm whether they want to skip prework rather than silently ignoring the harness.
