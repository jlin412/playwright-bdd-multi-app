# Claude Code QA Toolkit v3 — Index

This repo's AI-native QA toolkit is organized into portable layers plus repo-specific
memory. This file is a **map** — the content lives in the layers below.

| Need | Go to |
|---|---|
| **How** to run a QA phase (methodology) | `.claude/skills/` (paired subagents in `.claude/agents/`) |
| **What** to cover / review gates | `.claude/checklists/` |
| **What shape** the artifact takes | `.claude/templates/` |
| **How** tests are written in this repo | [`.claude/project/conventions.md`](project/conventions.md) |
| Stack / registry / env / run matrix | [`.claude/project/stack.md`](project/stack.md) |
| Lifecycle + state-derivation rules | [`.claude/workflow/pipeline.md`](workflow/pipeline.md) |
| The durable artifacts (+ metadata) | [`artifacts/README.md`](../artifacts/README.md); worked example: `artifacts/petstore/` |
| Full architecture (human) | root [`CLAUDE.md`](../CLAUDE.md) |

## Pipeline (each stage = one reviewable artifact, per feature)

1. `/plan-*` → `artifacts/<feature>/plan.md` (+ `plan.yaml`)
2. `/manual-*` → `artifacts/<feature>/manual.md` + `execution.md` (+ `bugs.md`)
3. `/auto-plan-*` → `artifacts/<feature>/automation.md` (Part A) + `automation.yaml`
4. `/auto-*` → code in `apps/<app>/` + `automation.md` (Part B)

Human review gates every arrow (`/review` → `/approve`; `/revise` sends back). Workflow
state is **derived from the per-stage YAML sidecars** by the `qa-workflow` skill (it
validates order and refuses out-of-order runs) and surfaced by `/status` — no chat history
required. A `fail` case becomes a `@triage` reproduction test — see the `qa-triage` skill
and [`project/conventions.md`](project/conventions.md) for the tag rules.

## Coverage checklists

Before planning, manual design, and automation planning, read the relevant single-source
checklists in `.claude/checklists/`. The **mode → checklist** mapping lives in
[`project/conventions.md`](project/conventions.md#coverage-checklists-to-consult-by-mode).

`/bootstrap` regenerates `project/conventions.md` + `project/stack.md` when the stack changes.
