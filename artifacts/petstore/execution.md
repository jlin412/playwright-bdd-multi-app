# Execution Log — petstore

> Ported example. Petstore predates the manual `execution.md` split, so these results are
> captured from the automated run recorded in the v6 automation report.

## Run

- Feature / App: petstore
- Target / Environment: https://petstore.swagger.io/
- Run date: 2026-06-30
- Executed by: `/auto-api` (automated)
- Build / Version: sandbox
- Type: automated (`npm run test:petstore` · `npm run test:bdd:petstore`)

## Summary

| Pass | Fail | Blocked | Not-run | Total |
|---|---|---|---|---|
| 24 | 0 | 0 | 0 | 24 |

## Results

All 24 cases (`TC-P01`–`P10`, `TC-S01`–`S05`, `TC-U01`–`U08`, `TC-A01`) passed; actual
matched intended for every case, so no `@triage` repros. Per-case automation coverage is
in [`automation.md`](automation.md) § Traceability.

| Test ID | Status | Matches Intended? | @triage | Notes |
|---|---|---|---|---|
| TC-P01–P10 | pass | yes | no | pet resource: CRUD, findByStatus, upload |
| TC-S01–S05 | pass | yes | no | store: inventory, order round-trip, negatives |
| TC-U01–U08 | pass | yes | no | user: CRUD, login/logout |
| TC-A01 | pass | yes | no | cross-resource smoke |

## Blockers

None.
