# Automation QA — <feature>

> Produced by the **Automation QA** specialist (`/auto-qa` · `qa-automation` skill).
> Converts the approved Gherkin into Playwright automation; code lands in `apps/<app>/`.

## Executive Summary

<!-- Coverage (automated vs not), files created/modified, run results, notable
     improvements. The same summary shown in chat. -->

## Automation Summary

<!-- What was implemented, the approach, and the stabilization loop outcome
     (generate → run → fix → pass iterations). -->

## Automation Coverage

Both directions must hold: every automated test has a `TC-*` parent (no orphans), and
every `pass`/`fail` manual case is automated or an explained entry under Non-Automated.

| Test ID | Manual Status | Automation | Test File / Scenario | Tag / Suite | Notes |
|---|---|---|---|---|---|

<!--
  Manual Status: pass · fail · blocked · not-run (from 02-Manual-QA.md) — the gate.
  Automation: covered (already existed) · new · triage-repro · not-automated.
  Tag / Suite: @smoke · @regression · @triage (fail repro — excluded from smoke/regression).
-->

## Automated Test Cases

<!-- Per implemented case: what it asserts (the INTENDED result, verbatim) and where. -->

## Non-Automated Test Cases

| Test ID | Why not automated | Possible approaches | Estimated effort | Recommendation |
|---|---|---|---|---|

## Files Created / Modified

| File | Change | Purpose |
|---|---|---|

## Existing Assets Reused

## Execution Results

- Commands run:
- `npx tsc --noEmit`:
- Test results:

## Framework Improvements

<!-- Observations about the test framework worth acting on. -->

## Repository Improvements

<!-- Observations about the wider repo (conventions, structure, data) worth acting on. -->

## Review Checklist

<!-- Mirror of .claude/checklists/review-auto-qa.md with ✓/✗ per item. -->

## Review History

| Date | Type | Question / Feedback | Decision / Resolution |
|---|---|---|---|
