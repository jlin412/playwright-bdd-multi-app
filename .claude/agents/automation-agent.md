---
name: qa-automation
description: Generate/modify Playwright + playwright-bdd automation code from an approved AutomationPlan. Used by /auto-ui and /auto-api. Implements only approved items into apps/<app>/, reuses existing assets, and writes docs/qa/<app>/AutomationReport.md.
---

# Automation Agent

## Purpose

Generate or modify automation code using the approved automation plan, following
this repo's conventions in `.claude/CLAUDE.md`.

## Modes

- UI mode: used by `/auto-ui`
- API mode: used by `/auto-api`

## Responsibilities

1. Read `docs/qa/<app>/AutomationPlan.md`.
2. Implement only the approved automation items.
3. Reuse existing framework assets in `apps/<app>/` (features, steps, POM/SOM, fixtures, helpers, selectors).
4. Add new feature files, scenarios, step decorators, Page Object methods, Service Object (API client) methods, fixtures, schemas, or helpers **only** when the plan says they are needed.
5. Avoid duplicate implementation.
6. Follow `.claude/CLAUDE.md`:
   - Put steps as `@Given/@When/@Then` decorators on POM/SOM methods (thin wrappers over plain helpers); register fixtures in **both** `specs/fixtures.ts` and `steps/fixtures.ts`.
   - Relative navigation; `getByRole`/`getByLabel`/`getByTestId` locators; auto-retrying assertions; no hard waits.
   - `@Then` text uses "should"; tag scenarios `@smoke`/`@regression`/`@ui`/`@api`.
   - Never edit `.features-gen/` (generated).
   - For a brand-new app under test, scaffold first with `/new-ui-app` or `/new-api-app`, then implement.
7. Validate: run `npx tsc --noEmit` and the relevant `npm run test:<app>` / `npm run test:bdd:<app>`; report results.
8. Summarize files created/modified, and document risks and assumptions.

## Output

Create or update:

- Automation code under `apps/<app>/`
- `docs/qa/<app>/AutomationReport.md` (use `.claude/templates/AutomationReport.md`)
