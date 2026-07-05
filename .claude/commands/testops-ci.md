# /testops-ci

Close the loop on a PR's CI run — examine the TestOps matrix results, classify every
failure and flake, discuss each issue with the user, apply agreed test-side fixes, and
push until green (capped). Execution utility — **no deliverable, no review checklist**;
the ledger and the CI sticky comment are the durable records. For a local point-in-time
release assessment use `/testops`.

Input `$ARGUMENTS`: optional PR number. Default: the current branch's open PR
(`gh pr view --json number`); if none exists, stop and say so.

## Run

Follow the **qa-testops-ci** skill. In short, per iteration:

1. **Examine** — find the PR head SHA's "TestOps verdict" run (`gh run watch` if in
   progress), download the `pwreport-*` + `testops-*` artifacts, and read per-test
   verdicts from the JSON reports: `flaky` = failed once, passed on retry (reported
   even when the suite is green); `unexpected` = failed both attempts.
2. **All green, no flakes** → report the per-suite table, append the ledger, stop.
3. **Anything red or flaky** → show results, then discuss **one issue at a time** in
   the main conversation (evidence → classification → recommended fix → agreement).
   Never fix product defects here.
4. **Fix → verify locally → push** — agreed fixes are verified locally in isolation
   first; commit + push re-triggers CI → next iteration. **Max 3 fix iterations**,
   then forced `not-ready` and hand off.

The discussion always happens in the main conversation — never inside a subagent.

## Report

- Per-suite table each iteration: pass / fail / flaky counts + duration + verdict.
- Final status in chat; the CI sticky comment (posted by `testops.yml`) carries the
  same verdict on the PR.
- Every iteration appends one row per suite to `deliverables/_repo/ledger.md`
  (`Scope: ci`).
