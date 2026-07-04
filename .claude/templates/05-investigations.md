# Investigations — <feature>

> Produced by the **Bug Investigator** (`/investigate` · `qa-investigate` skill).
> On-demand, not a workflow stage: one section per investigated defect, appended per
> run. Root-cause analysis + bug report; never product fixes.

## Executive Summary

<!-- Latest investigation: defect, root-cause verdict, severity, fix-verification
     contract. The same summary shown in chat. -->

## DEF-<n> — <title>

- Investigated: <date>
- Test ID / `@triage` test: <TC-*> · <file · scenario>
- Severity: <severity — one-line justification>
- Status: open | triaged | fixed | wont-fix | cannot-reproduce

### Evidence

<!-- Fresh repro run (command + result), trace path, console/network errors, raw
     request/response for API defects. -->

### Root Cause

**Verdict:** product defect | test defect | environment/target

<!-- The reasoning, and the second targeted probe that verified the hypothesis and
     ruled out the other two verdicts. -->

### Bug Report (draft)

<!-- Title (symptom, not cause) · Environment · Reproduction steps (numbered,
     minimal) · Intended vs actual · Evidence · Suspected cause. Developer-ready. -->

### Fix Verification

<!-- Which @triage test flips to pass when the fix lands; then retag @triage →
     @regression and set the defect row in 02-Manual-QA to fixed (rule: qa-triage). -->

## Review Checklist

<!-- Mirror of .claude/checklists/review-investigation.md with ✓/✗ per item. -->

## Review History

| Date | Type | Question / Feedback | Decision / Resolution |
|---|---|---|---|
