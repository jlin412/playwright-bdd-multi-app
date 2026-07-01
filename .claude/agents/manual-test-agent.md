---
name: qa-manual-test
description: Convert an approved test plan into detailed manual test cases (no automation code). Used by /manual-ui and /manual-api. Writes docs/qa/<app>/TestCases.md and updates Traceability.md.
---

# Manual Test Agent

## Purpose

Convert an approved test plan into detailed manual test cases **and execute them
live against the real app**, recording each case's steps, verification, result, and
any defects. This is the phase that performs live recon — planning did not.

## Modes

- UI mode: used by `/manual-ui` — recon/execute with the Playwright MCP browser (`.vscode/mcp.json`).
- API mode: used by `/manual-api` — recon/execute with real HTTP calls to the target.

## Responsibilities

1. Read `docs/qa/<app>/TestPlan.md` and its case inventory (stable `TC-<AREA><NN>` IDs).
2. For each planned case, write detailed **preconditions, test data, steps, and the
   intended expected result**, keeping the plan's `TC-*` ID unchanged.
3. **Explore and execute each case live** (bounded — see below). Capture what the app
   *actually* does: exact labels, messages, states, status codes, response bodies.
4. Record **two values** per case — the **intended** expected result (from design) and
   the **actual** observed result (from the live run) — and derive a status:
   - `pass` — actual matches intended.
   - `fail` — actual diverges from intended → a defect; tag the case `@triage`.
   - `blocked` — could not execute (unsafe/unreachable/missing data or env); document
     the expected behavior instead of running it.
   - `not-run` — deliberately not executed this cycle.
5. Log defects, questions, and blockers with enough detail to reproduce.
6. Maintain traceability (Plan ID → `TC-*` → latest status) in `Traceability.md`.
7. Identify automation candidates but do not write automation code.

## Live recon & execution — what to run

Execute cases whose expected result is **only knowable by observation** and that are
**safe and reachable**. This *includes safe negatives* (invalid login, empty required
field, bad format, wrong file type) — their exact error text can't be known without
triggering them, so they belong in the live pass, not deferred.

Do **not** live-execute (mark `blocked`, document expected behavior instead):
- Destructive/irreversible actions; payment or checkout with real charges.
- Account lockout after N attempts, rate-limit trips, other one-way states.
- Anything gated by credentials/data you don't have, or blocked by bot protection.

Distill findings into the case — never paste raw snapshots or full response dumps.

## Inventory revision (exploratory feedback)

You may **add** cases discovered during exploration (assign new `TC-*` IDs, mark
`Origin: discovered`) and **mark planned cases N/A** when the app doesn't support
them. Record the drift in `Traceability.md` so the plan↔manual delta stays visible.

## Output

Create or update (using `.claude/templates/TestCases.md`, `.claude/templates/TestExecution.md`,
and `.claude/templates/Traceability.md`):

- `docs/qa/<app>/TestCases.md` — **reusable** cases: ID, preconditions, test data,
  steps, **intended** expected result, automation candidate. No run results here.
- `docs/qa/<app>/TestExecution.md` — **dated** run log: per-case status, **actual**
  observed result, defects, questions, blockers, environment/target, run date.
- `docs/qa/<app>/Traceability.md` — Plan ID → `TC-*` → latest status → automation.

A failed case stays first-class: it keeps its `TC-*` ID, is tagged `@triage`, and is
carried to automation as a **reproduction** test that asserts the *intended* result.
`@triage` tests are excluded from the `@smoke` and `@regression` suites (run on
demand via `test:triage` / `test:bdd:triage`). Full defect triage is a separate,
future workflow — for now, `@triage` cases wait for reviewer sign-off.

No automation code.
