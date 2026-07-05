---
name: qa-testops-ci
description: Close the loop on a PR's CI run — harvest per-test retry outcomes from the TestOps matrix artifacts (flaky = failed once then passed, unexpected = failed both attempts), discuss each failure one at a time with the user, apply agreed test-side fixes verified locally, and push until green with a hard cap of 3 fix iterations. Used by /testops-ci. Appends every iteration to deliverables/_repo/ledger.md; no new deliverable file.
---

# TestOps CI-loop skill

Mission: turn a PR's CI signal into a fixed, green PR — human-in-the-loop. The CI run
already contains the flakiness evidence (both configs set `retries: 1` in CI, so every
test gets up to 2 attempts); this skill **never re-runs CI to probe for flakes** — it
reads the retry outcomes that are already there.

**Compose:** the classification taxonomy from `qa-testops` (product defect · test
defect · environment/target · flake) · `.claude/project/stack.md` (run matrix, local
commands). The discussion happens in the main conversation, one issue at a time.

## Examine (per iteration)

1. Resolve the PR (`gh pr view <n> --json headRefName,headRefOid,number`) and find the
   **"TestOps verdict"** workflow run for that head SHA:
   `gh run list --workflow "TestOps verdict" --branch <headRefName> --json databaseId,headSha,status,conclusion`.
   If the run is in progress, `gh run watch <run-id>` — never examine a stale SHA's run.
2. Download artifacts into a scratch dir:
   `gh run download <run-id> -p 'pwreport-*' -p 'testops-*' -D <scratch>`.
   - `testops-<suite>/…json` — suite-level `{suite,gate,outcome,duration_s}`.
   - `pwreport-<suite>/results.json` — the Playwright JSON report; per test, `status`
     is the verdict:
     - **`flaky`** — failed attempt 1, passed the retry (1 of 2). Collect these **even
       when the suite is green** — a recovered test doesn't fail the job, and this is
       the only place that signal surfaces.
     - **`unexpected`** — failed both attempts (2 of 2): a real failure (possible
       product defect or test/coding issue).
     - `expected` / `skipped` — pass / not run.
3. Report the per-suite table in chat (pass / fail / flaky counts, duration, gate) and
   append the ledger (below).
4. **All suites pass and no flaky tests → done.** The CI sticky comment already carries
   the verdict on the PR. End the loop.

Infra failures (missing artifacts, cancelled jobs, `EXPECTED`-count mismatch in the
verdict) are **reported to the user** — never auto-rerun anything.

## Discuss (only when something is red or flaky)

For each issue, **one at a time** in the main conversation:

- **Evidence** — the error + attempt history from `results.json`, plus
  `gh run view <run-id> --log-failed` for the suite log context. Distill; never paste
  raw dumps.
- **Classification** — flaky · test defect · product defect · environment/target
  (same taxonomy as `qa-testops`). External demo targets are slow/flaky — weigh that
  before calling a product defect.
- **Recommendation** — the concrete fix (e.g. `expect.poll`, shape-over-count
  assertion, generous timeout, locator hardening) with reasoning and impact.
- **Wait for agreement** before touching anything.

**Product defects are never fixed here.** Record them (in the feature's
`02-Manual-QA.md § Possible Defects` when that deliverable exists), suggest
`/investigate <feature>`, and note that the verdict stays `not-ready` while they're
open.

## Fix → verify locally → push

Only after agreement, and only test-side changes:

1. Apply the fix.
2. **Verify in isolation first**: run the affected spec/project locally
   (`npx playwright test <file> --project=<project>`; BDD via
   `node scripts/bdd.mjs <app> --feature <name>`). For a flake fix, soak it:
   `--repeat-each=5`.
3. Then run the affected suite locally (the matrix commands in
   `.claude/project/stack.md`). Only when green: commit + push to the PR branch —
   CI re-triggers automatically.
4. Next iteration: back to **Examine** for the new run.

**Hard cap: 3 fix iterations.** Still red after that → report a forced `not-ready`,
summarize exactly what remains and why, and hand off to the user. Also stop early
whenever the only remaining issues are product defects or environment problems no test
change can fix.

## Ledger

Every iteration appends one row per suite to the append-only
`deliverables/_repo/ledger.md` (create it with this header on first run):

```
| Date | Scope | Suite | Pass | Fail | Flaky | Duration | Verdict |
```

`Scope` = `ci`; Pass/Fail/Flaky are the real per-test counts from `results.json`;
Verdict = the run's verdict (`ready` / `ready-with-risks` / `not-ready`), repeated per
row — same shape `/testops` uses, so trends read across both.

## Output

Chat report per iteration + final status; ledger rows; the CI sticky PR comment
(owned by `.github/workflows/testops.yml`) carries the verdict on the PR. No new
deliverable file — this is an operational loop, not a workflow stage.
