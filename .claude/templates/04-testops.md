# TestOps — <feature>

> Produced by the **TestOps** specialist (`/testops` · `qa-testops` skill). Validates
> overall automation quality and release readiness.

## Executive Summary

<!-- Per-suite results, failures by cause, flaky tests, runtime, the release verdict.
     The same summary shown in chat. -->

## Execution Summary

- Run date:
- Scope: <app / whole repo>
- Environment / targets:

| Suite | Command | Pass | Fail | Flaky | Skipped | Duration |
|---|---|---|---|---|---|---|

<!-- Typical rows: spec smoke, BDD smoke, regression, UI, API, per-browser, @triage.
     @triage repros failing on their known defect is their expected state — report them
     separately, not as suite failures. -->

## Coverage

<!-- Automated coverage vs the plan's TC-* inventory + the gaps documented in
     03-Automation-QA.md; untested high-risk areas called out. -->

## Failure Analysis

| Test | Suite | Verdict | Root cause | Action |
|---|---|---|---|---|

<!-- Verdict: product defect · test defect · environment/target · flake (changed verdict
     on re-run). Re-run before declaring a flake a failure. -->

## Flaky Tests

| Test | Symptom | Cause | Fix applied / recommended |
|---|---|---|---|

## Runtime

<!-- Total + per-suite duration, worker settings, parallelism/duplication wins. -->

## Release Readiness

**Verdict:** ready | ready-with-risks | not-ready

<!-- Evidence: gate suites green? open defects (@triage register)? coverage gaps? -->

## Framework Improvement Suggestions

## Review Checklist

<!-- Mirror of .claude/checklists/review-testops.md with ✓/✗ per item. -->

## Review History

| Date | Type | Question / Feedback | Decision / Resolution |
|---|---|---|---|
