---
name: qa-automation-plan
description: Convert executed manual cases into an automation implementation plan (no code), aligned 1:1 to TC-*. Used by /auto-plan-ui and /auto-plan-api. Gates automation by execution status, decides reuse vs new per case, and writes docs/qa/<app>/AutomationPlan.md.
---

# QA Automation Planning skill

Turn executed cases into an implementation plan aligned **1:1** with them — every planned
test traces to a `TC-*`, and no test is planned without a verified manual parent. No code.
Mode: `UI` or `API`.

**Compose:** qa-workflow (state) · `.claude/project/conventions.md` (framework, standards,
where code goes) · template `AutomationPlan.md`. Inspect only the relevant `apps/<app>/` files.

## Do

1. Read `TestCases.md` (intended results) + `TestExecution.md` (status + actual results).
2. **Gate each case by execution status** (the alignment gate):
   - `pass` → automate as a normal test asserting the intended result (`@smoke`/`@regression`).
   - `fail` → automate as a `@triage` **reproduction** asserting the *intended* result
     (see the **qa-triage** skill); excluded from smoke/regression. Never assert the buggy
     observed value.
   - `blocked` / `not-run` → do **not** automate; record as a documented coverage gap.
3. Within an automatable case, decide: already covered · a new scenario on an existing
   feature/spec · a new feature/spec. **Do not invent tests without a `TC-*` parent.**
4. Identify reusable assets in `apps/<app>/` (features, step decorators, POM/SOM,
   fixtures, hooks, utilities, schemas, selectors, tags) and the new assets needed +
   where they belong.
5. Recommend tags + execution suite; plan assertions to reuse the **intended** expected
   values from `TestCases.md` verbatim.
6. Verify alignment **both ways** in `Traceability.md`: every planned test maps to a
   `TC-*` (no orphans), and every `pass`/`fail` case is covered or listed as a gap.

## Output

`docs/qa/<app>/AutomationPlan.md` (from the template). No automation code.
