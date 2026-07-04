---
name: qa-automation
description: Convert the approved Gherkin and manual cases into high-quality Playwright automation. Evaluates EVERY manual case, maximizes automation, explains and estimates every case not automated, generates tests/steps/POM/SOM/fixtures reuse-first, and iterates generate→run→fix locally until stable. Used by /auto-qa. Writes code into apps/<app>/ + deliverables/<feature>/03-Automation-QA.md.
---

# Automation QA skill

Mission: convert the approved Gherkin into high-quality Playwright automation. Inputs:
`01-Test-Plan.md`, `02-Manual-QA.md`, the updated Gherkin in `apps/<app>/features/`,
and the existing repository — framework, step definitions, page objects, fixtures, and
conventions. Bias strongly toward Playwright best practices. **Maximize automation.**

**Compose:** `.claude/project/conventions.md` (dual-style POM/SOM, three-section layout,
locators, tags, where code is written) · **qa-triage** (for `fail` cases) · template
`.claude/templates/03-automation-qa.md`. The `/auto-qa` command runs the `qa-review`
protocol after this skill.

## Decide (evaluate EVERY manual case)

1. Read `02-Manual-QA.md`. Evaluate **every** `TC-*` case and gate it by its manual
   execution status:
   - `pass` → automate as a normal test asserting the intended result
     (`@smoke`/`@regression`).
   - `fail` → automate as a `@triage` **reproduction** asserting the *intended* result
     (see **qa-triage**); excluded from smoke/regression. Never assert the buggy
     observed value.
   - `blocked` / `not-run` → normally not automatable — record as a documented gap
     unless automation can safely supply what manual couldn't (e.g. seeded data).
2. Within an automatable case, decide: already covered · a new scenario on an existing
   feature/spec · a new feature/spec. **No test without a `TC-*` parent.**
3. For every case **not** automated, record: **why**, possible automation approaches,
   estimated effort, and a recommendation — it stays visible in the deliverable, not
   silently dropped.
4. Identify reusable assets in `apps/<app>/` (features, step decorators, POM/SOM,
   fixtures, hooks, utilities, schemas, selectors, tags) before planning any new asset.

## Implement

5. Generate tests, step definitions, page objects, service objects, fixtures, and
   helper code into `apps/<app>/`, following the existing architecture and
   `.claude/project/conventions.md`: dual-style POM/SOM + `@Given/@When/@Then`
   decorators; register each fixture in **both** `specs/fixtures.ts` and
   `steps/fixtures.ts`; relative navigation; `getByRole`/`getByLabel`/`getByTestId`;
   auto-retrying assertions; `@Then` uses "should"; never edit `.features-gen/`.
6. **Transcribe, don't invent**: assertions use the **intended** expected values from
   `02-Manual-QA.md` verbatim. Carry each `TC-*` ID into the test/scenario title.
7. Implementing a `@manual`-tagged scenario? Implement its steps, then retag it
   (`@smoke`/`@regression` per its priority — or `@triage` for a fail repro).
8. For a brand-new app under test, scaffold first (`/new-ui-app` / `/new-api-app`).

## Stabilize (internal loop)

9. Execute locally and iterate until stable:

   ```
   Generate → Run → Fix → Run → Pass
   ```

   Validate with `npx tsc --noEmit` plus the relevant `npm run test:<app>` /
   `npm run test:bdd:<app>` (and `test:triage` / `test:bdd:triage` for repros — a
   `@triage` test failing on the known defect is its expected, stable state). Re-run to
   distinguish flake from failure. Report the run commands and results honestly.

## Output

- Automation code under `apps/<app>/`.
- `deliverables/<feature>/03-Automation-QA.md`: automation summary, coverage (the
  `TC-*` ↔ test file/tag ledger — every automated test has a `TC-*` parent; every
  `pass`/`fail` case is automated or an explained gap), automated cases, non-automated
  cases (reasons, alternative approaches, effort, recommendation), execution results,
  and framework/repository improvement observations — plus Review Checklist and Review
  History.
