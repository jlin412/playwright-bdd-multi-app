# Manual QA — <feature>

> Produced by the **Manual QA** specialist (`/manual-qa` · `qa-manual` skill). Live
> validation of the test plan (Playwright MCP for UI, real HTTP for API) + the Gherkin
> specification for automation. No automation code.

## Executive Summary

<!-- Cases executed (pass/fail/blocked/not-run), possible defects, ambiguities,
     discovered cases, Gherkin files touched. The same summary shown in chat. -->

## Manual Validation Summary

- Target / Environment:
- Run date:
- Mode: UI | API | both

| Pass | Fail | Blocked | Not-run | Total |
|---|---|---|---|---|
|  |  |  |  |  |

## Test Cases

| Test ID | Origin | Area | Scenario | Priority | Preconditions | Test Data | Steps | Expected Result (Intended) | Actual Result (Observed) | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|

<!--
  Test ID: the stable TC-<AREA><NN> from the plan; new discoveries get new IDs.
  Origin: planned · discovered (found during live exploration).
  Expected Result (Intended): what SHOULD happen — automation asserts this verbatim.
  Status: pass · fail (→ defect, @triage) · blocked (document expected behavior) · not-run.
-->

## Discovered Issues & Ambiguities

<!-- Unclear requirements, surprising-but-maybe-intended behavior, product questions. -->

## Possible Defects

| # | Test ID | Severity | Status | Intended (expected) | Actual (observed) | Repro / @triage test | Notes |
|---|---|---|---|---|---|---|---|

<!-- Status: open · triaged · fixed · wont-fix · cannot-reproduce. -->

## Repository Updates (Gherkin)

| File | Change | Scenarios (TC-*) | Reused steps | New steps needed | Tags |
|---|---|---|---|---|---|

<!-- Change: created · updated. Scenarios not yet implemented are tagged @manual until
     /auto-qa implements their steps. -->

## Inventory Drift

<!-- Planned cases marked N/A + discovered cases added, with reasons. -->

## Review Checklist

<!-- Mirror of .claude/checklists/review-manual-qa.md with ✓/✗ per item. -->

## Review History

| Date | Type | Question / Feedback | Decision / Resolution |
|---|---|---|---|
