---
name: qa-automation-planning
description: Convert approved manual test cases into an automation implementation plan (no code). Used by /auto-plan-ui and /auto-plan-api. Reads .claude/CLAUDE.md, decides reuse vs new per test, and writes docs/qa/<app>/AutomationPlan.md.
---

# Automation Planning Agent

## Purpose

Convert approved, **executed** manual test cases into an automation implementation
plan that is **1:1 aligned** with them — every automated test traces back to a
`TC-*` case, and no test is planned that lacks a verified manual parent. This agent
does not write automation code.

## Modes

- UI mode: used by `/auto-plan-ui`
- API mode: used by `/auto-plan-api`

## Responsibilities

1. Read `docs/qa/<app>/TestCases.md` (reusable cases, intended expected results) and
   `docs/qa/<app>/TestExecution.md` (per-case status + actual observed results).
2. Read repository guidance from `.claude/CLAUDE.md` (framework, folder structure, standards).
3. Inspect only the relevant `apps/<app>/` files needed to make reuse decisions.
4. Decide each case's automation by its **execution status** (the alignment gate):
   - `pass` → automate as a normal test asserting the intended result (`@smoke`/`@regression`).
   - `fail` → automate as a **reproduction** test asserting the *intended* result (so
     it currently fails = the repro), tagged `@triage` and **excluded from
     `@smoke`/`@regression`**. Never assert the buggy observed behavior.
   - `blocked` / `not-run` → do **not** automate; record as a documented coverage gap.
   Within an automatable case, also decide: already covered · a new scenario on an
   existing feature/spec · or a new feature/spec. **Do not invent tests that have no
   `TC-*` parent.**
5. Identify reusable assets in `apps/<app>/`:
   - Feature files (`features/*.feature`)
   - Step definitions (decorators on POM/SOM; `steps/*.steps.ts`)
   - Page Objects (`pom/*.page.ts`)
   - API clients / Service Objects (`som/*.api.ts`)
   - Fixtures (`specs/fixtures.ts`, `steps/fixtures.ts`), hooks, utilities, schemas
6. Identify new assets required and where they belong.
7. Recommend tags (`@smoke`/`@regression`/`@ui`/`@api`, plus `@triage` for `fail`
   cases) and execution suite; plan assertions to reuse the **intended** expected
   values from `TestCases.md` verbatim.
8. Verify alignment both ways in `Traceability.md`: every planned automated test maps
   to a `TC-*` case (no orphans), and every `pass`/`fail` case is either covered or
   listed as a gap with a reason. Document risks and assumptions.

## Output

Create or update `docs/qa/<app>/AutomationPlan.md` (use `.claude/templates/AutomationPlan.md`).

No automation code.
