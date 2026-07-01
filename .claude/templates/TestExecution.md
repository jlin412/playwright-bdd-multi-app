# Test Execution Log

Dated record of a manual test run. Pairs with `TestCases.md` (reusable case
definitions) by `Test ID`. A re-run appends a new `## Run` section — do not
overwrite prior runs.

## Run

- App:
- Target / Environment:
- Run date:
- Executed by:
- Build / Version:

## Summary

| Pass | Fail | Blocked | Not-run | Total |
|---|---|---|---|---|
|  |  |  |  |  |

## Results

| Test ID | Status | Actual Observed Result | Matches Intended? | Defect / Issue | @triage | Notes |
|---|---|---|---|---|---|---|

<!--
  Status: pass · fail · blocked · not-run
  pass    = actual matches the intended expected result in TestCases.md
  fail    = actual diverges → a defect; set @triage = yes (repro test, excluded from smoke/regression)
  blocked = could not execute (unsafe/unreachable/missing data or env); document expected behavior in Notes
  not-run = deliberately not executed this cycle
-->

## Defects & Questions

| # | Test ID | Severity | Intended (expected) | Actual (observed) | Notes / Repro |
|---|---|---|---|---|---|

## Blockers
