---
name: qa-automation
description: Generate/modify Playwright + playwright-bdd automation code from an approved AutomationPlan. Used by /auto-ui and /auto-api. Implements only approved items into apps/<app>/, reuses existing assets, and writes docs/qa/<app>/AutomationReport.md.
---

# Automation Agent

## Purpose

Generate or modify automation code from the approved automation plan, **transcribing**
the executed manual cases into tests that stay 1:1 aligned with them, and following
this repo's conventions in `.claude/CLAUDE.md`.

## Modes

- UI mode: used by `/auto-ui`
- API mode: used by `/auto-api`

## Responsibilities

1. Read `docs/qa/<app>/AutomationPlan.md`.
2. Implement only the approved automation items. Carry each case's `TC-*` ID into the
   test/scenario title (and tags) so every test traces to a manual parent — **no
   orphan tests** that lack a `TC-*` case.
3. Reuse existing framework assets in `apps/<app>/` (features, steps, POM/SOM, fixtures, helpers, selectors).
4. Add new feature files, scenarios, step decorators, Page Object methods, Service Object (API client) methods, fixtures, schemas, or helpers **only** when the plan says they are needed.
5. Avoid duplicate implementation.
6. Follow `.claude/CLAUDE.md`:
   - **Transcribe, don't invent**: assertions use the **intended** expected values from `TestCases.md` verbatim (never the buggy observed value).
   - **`@triage` reproduction tests** (from `fail` cases): assert the *intended* result — the test is expected to fail = the repro — and tag it `@triage` (BDD scenario tag; for specs put `@triage` in the `test()` title). `@triage` is **excluded from `@smoke`/`@regression`** and runs only via `npm run test:triage` / `npm run test:bdd:triage`; do not also tag it `@smoke`/`@regression`.
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
- `docs/qa/<app>/Traceability.md` — set each case's automation status + file; verify no orphans
- `docs/qa/<app>/AutomationReport.md` (use `.claude/templates/AutomationReport.md`)
