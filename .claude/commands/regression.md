# /regression

Run the regression suites on demand and report the result. Execution utility — **no
deliverable, no ledger, no interactive review**. For the full picture (failure triage,
flake analysis, coverage, release verdict, trend ledger) use `/testops`.

Input `$ARGUMENTS`: optional `<app>` to scope to one app.

## Run

Regression is `@smoke` + `@regression` and includes `specs/e2e/workflows/**` (no
`SMOKE_ONLY`), in both styles:

- **Whole repo**: `npm run test:ui:regression` (spec, UI), `npm run test:api:regression`
  (spec, API), then `npm run test:bdd:regression` (BDD).
- **One app** (`<app>`): `npx playwright test apps/<app>` (spec — includes that app's
  workflows), then
  `node scripts/bdd.mjs <app> --tags "(@smoke or @regression) and not @tracefail and not @triage"`
  (BDD).

## Report

- One line per suite: pass / fail / flaky counts + duration.
- List any failing tests by name, with the one-line cause where it's obvious.
- Point to traces: `npm run report` (spec) · `npm run report:bdd:html` (BDD).
- External targets (petstore) are slow/flaky — re-run a lone failure before calling it
  broken (CI uses `retries: 1`).

Then stop. This command only runs and reports; it writes nothing.
