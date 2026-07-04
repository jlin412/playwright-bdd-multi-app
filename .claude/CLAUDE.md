# Claude Code QA Toolkit v4 — Index

This repo's AI-native QA toolkit is four specialist agents behind four slash commands,
organized into portable layers plus repo-specific memory. This file is a **map** — the
content lives in the layers below.

| Need | Go to |
|---|---|
| **How** each specialist works (methodology) | `.claude/skills/` (paired subagents in `.claude/agents/`) |
| **How** every command reviews its deliverable | [`.claude/skills/qa-review/SKILL.md`](skills/qa-review/SKILL.md) |
| **What** to cover / review checklists | `.claude/checklists/` |
| **What shape** the deliverable takes | `.claude/templates/` |
| **How** tests are written in this repo | [`.claude/project/conventions.md`](project/conventions.md) |
| Stack / registry / env / run matrix | [`.claude/project/stack.md`](project/stack.md) |
| The durable deliverables | [`deliverables/README.md`](../deliverables/README.md) (v3 archive: `artifacts/`) |
| Full architecture (human) | root [`CLAUDE.md`](../CLAUDE.md) |

## Workflow (strictly sequential — no state machine, no approval command)

```
Requirements → /test-plan → /manual-qa → /auto-qa → /testops
```

| Command | Specialist | Deliverable |
|---|---|---|
| `/test-plan` | Test Plan — WHAT to test (risks, strategy, scenarios, coverage matrix; **not** automation scope) | `deliverables/<feature>/01-Test-Plan.md` |
| `/manual-qa` | Manual QA — live validation (Playwright MCP / real HTTP) + Gherkin spec, reuse-first | `02-Manual-QA.md` + `apps/<app>/features/` |
| `/auto-qa` | Automation QA — evaluate every case, maximize automation, generate → run → fix until stable | `03-Automation-QA.md` + code in `apps/<app>/` |
| `/testops` | TestOps — run smoke/regression/UI/API/cross-browser, flake + failure analysis, release readiness | `04-TestOps.md` |

Running the next command **implicitly accepts** the previous stage. Every workflow
command follows the same pattern (the `qa-review` skill): generate → **open the
deliverable** → Executive Summary → Review Checklist (✓/✗) → interactive review, **one
question at a time** (recommendation + reasoning + impact) → feedback loop until the
user has none → **stop** (never auto-continue). Each deliverable carries
**Executive Summary · Review Checklist · Review History** — the audit trail.

`/status` derives progress from which deliverables exist. Utilities: `/new-ui-app`,
`/new-api-app` (scaffold a target app), `/bootstrap` (regenerate Project Memory).
A `fail` case becomes a `@triage` reproduction test — see the `qa-triage` skill and
[`project/conventions.md`](project/conventions.md) for the tag rules (including
`@manual` for not-yet-implemented scenarios).

## Coverage checklists

Before planning, manual validation, and automation, read the relevant single-source
checklists in `.claude/checklists/`. The **mode → checklist** mapping lives in
[`project/conventions.md`](project/conventions.md#coverage-checklists-to-consult-by-mode).

`/bootstrap` regenerates `project/conventions.md` + `project/stack.md` when the stack changes.
