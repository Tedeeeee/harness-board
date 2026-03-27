# ddokddok Prework Harness Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repo-scoped Codex prework harness for `C:\study\ddokddok` that guides new work through requirements, design direction, and kickoff readiness before implementation.

**Architecture:** Use root `AGENTS.md` for project guidance, `.codex/agents` for specialized custom agents, and `.agents/skills/prework-harness` for the reusable workflow. Store outputs and templates under `docs/superpowers` so the harness leaves durable artifacts in the repo folder.

**Tech Stack:** Codex project instructions, Codex custom agent TOML files, Codex repo skills, Markdown documentation

---

## Chunk 1: Core Discovery Files

### Task 1: Create the project guidance and local config

**Files:**
- Create: `C:\study\ddokddok\AGENTS.md`
- Create: `C:\study\ddokddok\.codex\config.toml`

- [ ] **Step 1: Write the project rules**

Add root instructions that define:
- when the prework harness should trigger
- where specs and plans live
- which custom agents own which stage
- the current no-git constraint

- [ ] **Step 2: Write the local project config**

Add `.codex/config.toml` with:
- default model
- reasoning effort
- project instruction size allowance
- explicit enable entry for the local prework skill

- [ ] **Step 3: Verify the files exist**

Run:

```powershell
Get-ChildItem 'C:\study\ddokddok\AGENTS.md', 'C:\study\ddokddok\.codex\config.toml'
```

Expected: both files are listed.

## Chunk 2: Custom Agents

### Task 2: Create the orchestrator and role agents

**Files:**
- Create: `C:\study\ddokddok\.codex\agents\prework_orchestrator.toml`
- Create: `C:\study\ddokddok\.codex\agents\requirements_organizer.toml`
- Create: `C:\study\ddokddok\.codex\agents\design_direction_organizer.toml`
- Create: `C:\study\ddokddok\.codex\agents\kickoff_gatekeeper.toml`

- [ ] **Step 1: Write the orchestrator**

Define a workspace-write agent that owns the full prework sequence and points to the local skill.

- [ ] **Step 2: Write the three specialist agents**

Define focused agents for:
- requirements clarification
- design direction
- kickoff readiness review

- [ ] **Step 3: Verify the agent directory**

Run:

```powershell
Get-ChildItem 'C:\study\ddokddok\.codex\agents'
```

Expected: four `.toml` files appear.

## Chunk 3: Skill and Templates

### Task 3: Create the reusable prework skill

**Files:**
- Create: `C:\study\ddokddok\.agents\skills\prework-harness\SKILL.md`
- Create: `C:\study\ddokddok\.agents\skills\prework-harness\agents\openai.yaml`

- [ ] **Step 1: Write the skill metadata and workflow**

Describe when the skill should and should not trigger, the ordered phases, and the expected outputs.

- [ ] **Step 2: Add optional UI metadata**

Create `agents/openai.yaml` with a display name, description, and default prompt for explicit invocation.

- [ ] **Step 3: Verify the skill tree**

Run:

```powershell
Get-ChildItem -Recurse 'C:\study\ddokddok\.agents\skills\prework-harness'
```

Expected: `SKILL.md` and `agents\openai.yaml` are present.

### Task 4: Add output templates

**Files:**
- Create: `C:\study\ddokddok\docs\superpowers\templates\requirements-spec-template.md`
- Create: `C:\study\ddokddok\docs\superpowers\templates\design-direction-template.md`
- Create: `C:\study\ddokddok\docs\superpowers\templates\kickoff-readiness-template.md`

- [ ] **Step 1: Write the requirements template**

Include problem statement, target users, success criteria, constraints, non-goals, and open questions.

- [ ] **Step 2: Write the design and kickoff templates**

Include:
- design direction, user flows, MVP slice, risks
- kickoff verdict, blockers, and next actions

- [ ] **Step 3: Verify the templates**

Run:

```powershell
Get-ChildItem 'C:\study\ddokddok\docs\superpowers\templates'
```

Expected: all three templates are listed.

## Chunk 4: Final Verification

### Task 5: Validate the whole harness footprint

**Files:**
- Verify only

- [ ] **Step 1: Inspect the top-level harness layout**

Run:

```powershell
Get-ChildItem -Recurse 'C:\study\ddokddok\.codex', 'C:\study\ddokddok\.agents', 'C:\study\ddokddok\docs\superpowers'
```

Expected: the new guidance, agent, skill, plan, spec, and template files are all present.

- [ ] **Step 2: Inspect key files for correctness**

Run:

```powershell
Get-Content -Raw 'C:\study\ddokddok\AGENTS.md'
Get-Content -Raw 'C:\study\ddokddok\.agents\skills\prework-harness\SKILL.md'
Get-Content -Raw 'C:\study\ddokddok\.codex\agents\prework_orchestrator.toml'
```

Expected: the instructions consistently describe the same prework flow and output paths.

- [ ] **Step 3: Skip commit unless Git is initialized**

Run:

```powershell
Test-Path 'C:\study\ddokddok\.git'
```

Expected: `False` for the current workspace. If it becomes `True` later, commit the harness files in a follow-up step.
