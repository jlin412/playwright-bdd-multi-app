---
name: qa-investigate
description: Bug Investigator — root-cause one open defect from a feature's Possible Defects register. Replays the @triage repro for fresh evidence, delivers a product/test/environment verdict, drafts a developer-ready bug report, and defines the fix-verification contract. Used by /investigate. Appends to deliverables/<feature>/05-Investigations.md.
---

# Bug Investigator skill

Mission: turn one **open defect** into an investigated one — a root-cause verdict with
evidence, a bug report a developer can act on, and an objective fix-verification
contract. One defect per run. Investigation, not fixing: product fixes stay out of
scope, exactly as in `/testops`.

**Compose:** the defect register `deliverables/<feature>/02-Manual-QA.md § Possible
Defects` · the `@triage` repro contract in `.claude/skills/qa-triage/SKILL.md` ·
template `.claude/templates/05-investigations.md`. The `/investigate` command runs the
`qa-review` protocol after this skill.

## Evidence

- Re-run the defect's `@triage` reproduction (`npm run test:triage` /
  `npm run test:bdd:triage`, scoped to the app where possible) to produce a **fresh
  trace** — never investigate from a stale one.
- For API defects, also replay the HTTP call directly (curl or a `recon/` script) and
  capture the raw request/response.
- Collect the minimal set that demonstrates intended vs actual: trace path,
  console/network errors, response bodies, screenshots.

## Root cause

- Verdict: **product defect · test defect · environment/target issue** — with the
  evidence that rules out the other two. A test defect routes back to `/auto-qa`; an
  environment issue is documented, not reported as a bug.
- Localize (endpoint, component, data condition), form a hypothesis, and **verify it
  with a second targeted probe** — vary one input, hit the API behind the UI, check a
  parallel flow — never conclude from a single failure.

## Bug report (draft)

Title (symptom, not cause) · Severity with justification · Environment/target ·
Reproduction steps (numbered, minimal) · Intended vs actual · Evidence (trace path,
response excerpts) · Suspected cause · the `@triage` test that replays it.

## Fix verification

The `@triage` test asserts the **intended** behavior, so it is the fix's objective
check: when the fix lands, the repro passes. State the contract explicitly — which
test flips, then apply the `qa-triage` retag rule (`@triage` → `@regression`) and set
the defect row to `fixed`.

## Output

Append one `## DEF-<n> — <title>` section to
`deliverables/<feature>/05-Investigations.md` (create it from the template if absent)
and update the defect's Status in `02-Manual-QA.md § Possible Defects` (`open` →
`triaged`, or `cannot-reproduce` when the repro no longer fails) — plus Review
Checklist and Review History.
