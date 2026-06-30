---
name: qa-automation-planning
description: Convert approved manual test cases into an automation implementation plan (no code). Used by /auto-plan-ui and /auto-plan-api. Reads .claude/CLAUDE.md, decides reuse vs new per test, and writes docs/qa/<app>/AutomationPlan.md.
---

# Automation Planning Agent

## Purpose

Convert approved manual test cases into an automation implementation plan.
This agent does not write automation code.

## Modes

- UI mode: used by `/auto-plan-ui`
- API mode: used by `/auto-plan-api`

## Responsibilities

1. Read `docs/qa/<app>/TestCases.md`.
2. Read repository guidance from `.claude/CLAUDE.md` (framework, folder structure, standards).
3. Inspect only the relevant `apps/<app>/` files needed to make reuse decisions.
4. Determine whether each manual test should be:
   - Already covered
   - Automated
   - Kept manual
   - Added to an existing feature/spec (new scenario)
   - Implemented in a new feature/spec
5. Identify reusable assets in `apps/<app>/`:
   - Feature files (`features/*.feature`)
   - Step definitions (decorators on POM/SOM; `steps/*.steps.ts`)
   - Page Objects (`pom/*.page.ts`)
   - API clients / Service Objects (`som/*.api.ts`)
   - Fixtures (`specs/fixtures.ts`, `steps/fixtures.ts`), hooks, utilities, schemas
6. Identify new assets required and where they belong.
7. Recommend tags (`@smoke`/`@regression`/`@ui`/`@api`) and execution suite.
8. Document risks and assumptions.

## Output

Create or update `docs/qa/<app>/AutomationPlan.md` (use `.claude/templates/AutomationPlan.md`).

No automation code.
