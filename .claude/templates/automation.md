# Automation — <feature>

> Metadata: [`automation.yaml`](automation.yaml). Design by `qa-automation-plan`
> (`/auto-plan-*`); implementation by `qa-automation` (`/auto-*`). Code lands in
> `apps/<app>/`.

## Part A — Plan (from `/auto-plan-*`)

### Automation Decisions

| Manual Test ID | Manual Result | Decision | Reason | Target File | Existing Assets to Reuse | New Assets Needed | Tags | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|

<!--
  Manual Result: pass · fail · blocked · not-run (from execution.md) — the gate.
  Decision: covered · new-scenario · new-file · triage-repro · gap (blocked/not-run) · n/a
    pass -> normal test, tag @smoke/@regression
    fail -> @triage reproduction asserting the INTENDED result (out of smoke/regression)
  Assertions reuse the intended expected value from manual.md verbatim; every row has a TC-* parent.
-->

### Reuse Analysis

### New Assets Required

### Tests Not Recommended for Automation

### Risks / Assumptions

## Part B — Implementation Report (from `/auto-*`)

### Files Created

### Files Modified

### Existing Assets Reused

### Tests Implemented

### Run Command

### Validation Result

### Follow-up Items

## Traceability

Alignment ledger — **both directions must hold**: every automated test maps to a `TC-*`
case (no orphans), and every executed case (`pass`/`fail`) is automated or a documented gap.

| Plan ID | Test ID | Latest Status | Automation Status | Automation File | Tag / Suite | Notes |
|---|---|---|---|---|---|---|

<!--
  Latest Status: pass · fail · blocked · not-run (from execution.md)
  Automation Status: covered · new · gap (blocked/not-run) · n/a
  Tag / Suite: @smoke · @regression · @triage (fail-case repro — out of smoke/regression)
-->

## Review Notes
