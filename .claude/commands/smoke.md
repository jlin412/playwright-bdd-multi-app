# /smoke

Run the smoke suites on demand and report the result. Execution utility — **no
deliverable, no ledger, no interactive review**. For the full picture (failure triage,
flake analysis, coverage, release verdict, trend ledger) use `/testops`.

Input `$ARGUMENTS`: optional `<app>` to scope to one app.

## Run

Smoke is the must-pass gate (`@smoke`, `SMOKE_ONLY=1`) in both styles:

- **Whole repo**: `npm test` (spec, all apps), then `npm run test:bdd:smoke` (BDD).
- **One app** (`<app>`): `npm run test:<app>`, then `npm run test:bdd:<app>`.

## Report

- One line per suite: pass / fail / flaky counts + duration.
- List any failing tests by name, with the one-line cause where it's obvious.
- Point to traces: `npm run report` (spec) · `npm run report:bdd:html` (BDD).
- External targets (petstore) are slow/flaky — re-run a lone failure before calling it
  broken (CI uses `retries: 1`).

Then stop. This command only runs and reports; it writes nothing.
