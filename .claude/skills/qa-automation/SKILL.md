---
name: qa-automation
description: Implement approved automation code, transcribing executed manual cases into tests aligned 1:1 with TC-*. Used by /auto-ui and /auto-api. Reuses existing framework assets, follows project conventions, validates with tsc + tests, and writes code + artifacts/<feature>/automation.md (Part B).
---

# QA Automation skill

Generate or modify automation from the **approved** plan (`automation.md` Part A), **transcribing**
executed cases (not inventing) and following the repo's conventions. Mode: `UI` or `API`.

**Compose:** qa-workflow (state) · `.claude/project/conventions.md` (dual-style POM/SOM,
three-section layout, locators, tags, where code is written) · the **qa-triage** skill
(for `fail` cases) · template `automation.md` (Part B).

## Do

1. Read `artifacts/<feature>/automation.md` (Part A — the approved plan). Implement
   **only** approved items.
2. Carry each case's `TC-*` ID into the test/scenario title (and tags) — **no orphan
   tests** that lack a `TC-*` parent.
3. **Transcribe, don't invent**: assertions use the **intended** expected values from
   `manual.md` verbatim (never the buggy observed value).
4. `fail` cases → `@triage` reproduction tests asserting the *intended* result (see
   qa-triage): expected-to-fail = the repro, excluded from `@smoke`/`@regression`, run via
   `npm run test:triage` / `npm run test:bdd:triage`. Never also tag `@smoke`/`@regression`.
5. Reuse existing `apps/<app>/` assets (features, steps, POM/SOM, fixtures, helpers,
   selectors). Add new code **only** where the plan says.
6. Follow `.claude/project/conventions.md`: dual-style POM/SOM + `@Given/@When/@Then`
   decorators; register each fixture in **both** `specs/fixtures.ts` and
   `steps/fixtures.ts`; relative navigation; `getByRole`/`getByLabel`/`getByTestId`;
   auto-retrying assertions; `@Then` uses "should"; never edit `.features-gen/`.
7. For a brand-new app under test, scaffold first (`/new-ui-app` or `/new-api-app`),
   then implement.
8. Validate: `npx tsc --noEmit` and the relevant `npm run test:<app>` /
   `npm run test:bdd:<app>`. Report the run command and results.

## Output

- Automation code under `apps/<app>/`.
- `artifacts/<feature>/automation.md` — Part B (Implementation Report) + the § Traceability
  ledger (each case's automation status + file; verify no orphans); update `automation.yaml`
  (`substage: implemented`, validation fields).
