# Execution Log — <feature>

> Append-only. Each run adds a new `## Run` section — do not overwrite prior runs.
> Pairs with [`manual.md`](manual.md) (manual runs) and covers automated runs too.

## Run

- Feature / App:
- Target / Environment:
- Run date:
- Executed by:
- Build / Version:
- Type: manual | automated (`npm run test:<feature>` / `test:bdd:<feature>` / `test:triage`)

## Summary

| Pass | Fail | Blocked | Not-run | Total |
|---|---|---|---|---|
|  |  |  |  |  |

## Results

| Test ID | Status | Actual Observed Result | Matches Intended? | Defect / Issue | @triage | Notes |
|---|---|---|---|---|---|---|

<!--
  Status: pass · fail · blocked · not-run
  pass    = actual matches the intended expected result in manual.md
  fail    = actual diverges → a defect; set @triage = yes and log it in bugs.md
  blocked = could not execute (unsafe/unreachable/missing data or env); document expected behavior in Notes
  not-run = deliberately not executed this cycle
-->

## Blockers
