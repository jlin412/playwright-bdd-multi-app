---
name: qa-manual-design
description: Expand an approved test plan into detailed manual cases AND run them live against the real app, recording intended vs actual result and a status. Used by /manual-ui (Playwright MCP browser) and /manual-api (real HTTP). Writes TestCases.md + TestExecution.md and updates Traceability.md.
---

# QA Manual Design & Execution skill

The phase that performs **live recon** — planning did not. Mode: `UI` or `API`.

**Compose:** qa-workflow (state) · the mode's checklists (coverage) · templates
`TestCases.md`, `TestExecution.md`, `Traceability.md`.

## Do

1. Read `docs/qa/<app>/TestPlan.md` and its `TC-*` inventory.
2. For each planned case, write **preconditions, test data, steps, and the intended
   expected result** — keep the plan's `TC-*` ID unchanged.
3. **Execute each case live** (bounded — see below). Capture what the app *actually*
   does: exact labels, messages, states, status codes, response bodies.
   - **UI**: the Playwright MCP browser (`.vscode/mcp.json`).
   - **API**: real HTTP calls to the target.
4. Record **two values** per case — the **intended** (design) and the **actual** (run)
   result — and derive a status:
   - `pass` — actual matches intended.
   - `fail` — actual diverges → a defect; tag `@triage` (see the **qa-triage** skill).
   - `blocked` — couldn't execute (unsafe/unreachable/missing data or env); document the
     expected behavior instead of running it.
   - `not-run` — deliberately not executed this cycle.
5. Log defects, questions, and blockers with enough detail to reproduce.
6. Maintain traceability (Plan ID → `TC-*` → latest status) in `Traceability.md`.

## What to run vs defer

Run cases whose expected result is **only knowable by observation** and that are **safe
and reachable** — *including* safe negatives (invalid login, empty required field, bad
format, wrong file type); their exact error text can't be known without triggering them.

Do **not** live-run (mark `blocked`, document expected behavior instead): destructive or
irreversible actions; real charges; account lockout / rate-limit / other one-way states;
anything gated by credentials or data you don't have, or blocked by bot protection.

Distill findings into the case — never paste raw snapshots or full response dumps.

## Inventory revision

You may **add** cases discovered during exploration (new `TC-*` IDs, `Origin: discovered`)
and **mark planned cases N/A**. Record the drift in `Traceability.md`.

## Output

- `TestCases.md` — **reusable** cases (ID, preconditions, test data, steps, **intended**
  result, automation candidate). No run results here.
- `TestExecution.md` — **dated** run log (per-case status, **actual** observed result,
  defects, questions, blockers, environment/target, run date).
- `Traceability.md` — Plan ID → `TC-*` → latest status → automation.

No automation code.
