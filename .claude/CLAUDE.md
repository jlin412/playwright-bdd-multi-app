# Claude Code QA Toolkit v5 — Index

This repo's AI-native QA toolkit is four sequential specialist agents behind four slash
commands, plus an on-demand Bug Investigator, organized into portable layers plus
repo-specific memory. This file is a **map** — the content lives in the layers below.

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
| `/manual-qa` | Manual QA — live validation (Playwright MCP / real HTTP) + spec, reuse-first (UI Gherkin / API specs) | `02-Manual-QA.md` + `apps/<app>/features/` (UI) or `specs/api/` (API) |
| `/auto-qa` | Automation QA — evaluate every case, maximize automation, generate → run → fix until stable | `03-Automation-QA.md` + code in `apps/<app>/` |
| `/testops` | TestOps — run smoke/regression/UI/API/cross-browser, flake + failure analysis, release readiness | `04-TestOps.md` |

On demand (not stages): `/investigate <feature>` — Bug Investigator, root-causes one
open defect from `02-Manual-QA.md § Possible Defects` → `05-Investigations.md`;
`/testops repo` — whole-repo assessment with trends from the append-only
`deliverables/_repo/ledger.md` (every `/testops` run appends to it). CI posts the same
release verdict on PRs (`.github/workflows/testops.yml`, report-only).

Running the next command **implicitly accepts** the previous stage. Every workflow
command follows the same pattern (the `qa-review` skill): generate → **open the
deliverable** → Executive Summary → Review Checklist (✓/✗) → interactive review, **one
question at a time** (recommendation + reasoning + impact) → feedback loop until the
user has none → **stop** (never auto-continue). Each deliverable carries
**Executive Summary · Review Checklist · Review History** — the audit trail.

Review recommendations calibrate to your recorded preferences:
[`.claude/project/review-calibration.md`](project/review-calibration.md), distilled by
`/bootstrap` from `overridden:` Review History rows and applied by `qa-review` instead
of re-asking settled questions.

`/status` derives progress from which deliverables exist. Utilities: `/new-ui-app`,
`/new-api-app` (scaffold a target app), `/bootstrap` (regenerate Project Memory +
review calibration), `/smoke` and `/regression` (run those suites on demand — the
run-only slice of `/testops`, no deliverable or review), `/testops-ci [PR#]` (close the
loop on a PR's CI run: classify failures/flakes from per-test retry outcomes, discuss
one issue at a time, fix → verify locally → push, max 3 iterations — the `qa-testops-ci`
skill). A `fail` case becomes a `@triage` reproduction test — see the
`qa-triage` skill (including its retag-on-fix rule) and
[`project/conventions.md`](project/conventions.md) for the tag rules (including
`@manual` for not-yet-implemented scenarios).

## Coverage checklists

Before planning, manual validation, and automation, read the relevant single-source
checklists in `.claude/checklists/`. The **mode → checklist** mapping lives in
[`project/conventions.md`](project/conventions.md#coverage-checklists-to-consult-by-mode).

`/bootstrap` regenerates `project/conventions.md` + `project/stack.md` when the stack changes.
