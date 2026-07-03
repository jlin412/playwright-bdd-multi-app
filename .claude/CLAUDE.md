# Claude Code QA Toolkit v3 — Index

This repo's AI-native QA toolkit is organized into portable layers plus repo-specific
memory. This file is a **map** — the content lives in the layers below.

| Need | Go to |
|---|---|
| **How** to run a QA phase (methodology) | `.claude/skills/` *(agents in `.claude/agents/` until the Skills layer lands)* |
| **What** to cover (coverage gates) | `.claude/checklists/` |
| **What shape** the artifact takes | `.claude/templates/` |
| **How** tests are written in this repo | [`.claude/project/conventions.md`](project/conventions.md) |
| Stack / registry / env / run matrix | [`.claude/project/stack.md`](project/stack.md) |
| Pipeline narrative + worked example | [`docs/qa/README.md`](../docs/qa/README.md) |
| Full architecture (human) | root [`CLAUDE.md`](../CLAUDE.md) |

## Pipeline (each phase = one reviewable artifact, per app)

1. `/plan-*` → `docs/qa/<app>/TestPlan.md`
2. `/manual-*` → `docs/qa/<app>/TestCases.md` + `TestExecution.md` (+ `Traceability.md`)
3. `/auto-plan-*` → `docs/qa/<app>/AutomationPlan.md`
4. `/auto-*` → code in `apps/<app>/` + `docs/qa/<app>/AutomationReport.md`

Human review gates every arrow. State is tracked per app in
`docs/qa/<app>/ProjectState.md` via `.claude/agents/workflow-agent.md`, which
validates phase order (refuses out-of-order runs). A `fail` case becomes a `@triage`
reproduction test — see [`project/conventions.md`](project/conventions.md) for the tag
rules and [`docs/qa/README.md`](../docs/qa/README.md) for the full model.

## Coverage checklists

Before planning, manual design, and automation planning, read the relevant
single-source checklists in `.claude/checklists/`. The **mode → checklist** mapping
lives in [`project/conventions.md`](project/conventions.md#coverage-checklists-to-consult-by-mode).

`/bootstrap` regenerates `project/conventions.md` + `project/stack.md` when the stack
changes.
