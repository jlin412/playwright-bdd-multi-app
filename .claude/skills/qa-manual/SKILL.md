---
name: qa-manual
description: Validate the feature as a skilled manual tester and produce the approved specification for automation. Explores the app live (Playwright MCP for UI, real HTTP for API), executes happy paths, negatives, and edge cases against the test plan, records intended vs actual per TC-*, and specifies coverage reuse-first — UI Gherkin feature files, API spec tests (no API feature files). Used by /manual-qa. Writes deliverables/<feature>/02-Manual-QA.md + UI Gherkin / API spec updates.
---

# Manual QA skill

Mission: validate the feature as a skilled manual tester and produce the **approved
specification for automation**. This is the phase that performs **live recon** —
planning did not. Input: `deliverables/<feature>/01-Test-Plan.md` and its `TC-*`
inventory.

**Compose:** the mode's checklists (coverage) · `qa-triage` (for `fail` cases) ·
`.claude/project/conventions.md` (Gherkin rules) · template
`.claude/templates/02-manual-qa.md`. The `/manual-qa` command runs the `qa-review`
protocol after this skill.

## Explore and validate (Playwright MCP ≠ automation)

Playwright MCP (and real HTTP for APIs) is used here for **manual validation and
discovery** — it is *not* generating automation:

1. For each planned `TC-*`, write **preconditions, test data, steps, and the intended
   expected result** — keep the plan's ID unchanged.
2. **Execute each case live** (bounded — see below): happy paths, negative testing, and
   edge-case exploration. Capture what the app *actually* does: exact labels, messages,
   states, status codes, response bodies.
   - **UI**: the Playwright MCP browser (`.vscode/mcp.json`).
   - **API**: real HTTP calls to the target.
3. Record **two values** per case — the **intended** (design) and the **actual** (run)
   result — and derive a status:
   - `pass` — actual matches intended.
   - `fail` — actual diverges → a possible defect; tag `@triage` (see **qa-triage**).
   - `blocked` — couldn't execute (unsafe/unreachable/missing data or env); document the
     expected behavior instead of running it.
   - `not-run` — deliberately not executed this cycle.
4. Note ambiguities (unclear requirements, surprising behavior worth a product decision)
   and possible defects with enough detail to reproduce.

### What to run vs defer

Run cases whose expected result is **only knowable by observation** and that are **safe
and reachable** — *including* safe negatives (invalid login, empty required field, bad
format, wrong file type); their exact error text can't be known without triggering them.

Do **not** live-run (mark `blocked`, document expected behavior instead): destructive or
irreversible actions; real charges; account lockout / rate-limit / other one-way states;
anything gated by credentials or data you don't have, or blocked by bot protection.

Distill findings into the case — never paste raw snapshots or full response dumps.

## Existing coverage check (before authoring)

Before authoring any Gherkin, decide per `TC-*` **whether the case is already
implemented as a real test** — this gate runs first; reuse-first authoring runs only
for the cases it leaves uncovered.

For every planned/discovered `TC-*`, search existing implementations:

- **Spec** (always; the **only** style for API) — grep `apps/<app>/specs/**` for an
  existing spec-style test covering the same behavior.
- **UI BDD** — grep `apps/<app>/features/*.feature` for the `TC-*` ID in scenario titles
  and for the behavior, and confirm the scenario's steps are actually implemented
  (backed by POM/SOM `@Given/@When/@Then` decorators). A scenario tagged `@manual`
  (steps not yet implemented) does **not** count as covered.

Classify each case:

- **covered** — a real, non-`@manual` test already exists → record
  `Existing Coverage: <file>:<scenario|test name>`, **skip Gherkin authoring** for it,
  but still **live-validate** it if safe (capture intended vs actual as normal).
- **uncovered** — no real test exists → proceed to the reuse-first authoring below.

Ordering: **coverage check → (uncovered only) reuse-first authoring.** The coverage
check governs *whether to author at all*; reuse-first still governs *where* new
scenarios land and *which* steps they reuse.

## Specify the coverage (reuse-first)

Turn the validated cases into the specification `/auto-qa` will implement. The form
depends on the mode — **UI is Gherkin, API is spec-only**:

**UI → Gherkin in `apps/<app>/features/`:**

- Functionality belongs to an **existing feature** → update that feature file.
- Functionality is **new** → create a new feature file.
- Always attempt to reuse existing feature files and existing step definitions (grep
  `apps/<app>/features/` and the POM `@Given/@When/@Then` decorators before writing a
  new step).
- Carry the `TC-*` ID in the scenario title. Follow the feature-file structure, naming,
  and tag rules in `.claude/project/conventions.md`.
- Tag scenarios whose steps are **not yet implemented** `@manual` (no
  `@smoke`/`@regression` yet, so BDD runs stay green) — `/auto-qa` retags them when it
  implements the steps. Scenarios reusing only existing steps may keep real tags.

**API → spec tests in `apps/<app>/specs/api/` (never a `.feature` file):**

- Specify the cases as spec-style tests backed by SOM action methods. Functionality
  belonging to an existing API → update the existing `specs/api/*.spec.ts` + SOM.
- Reuse existing SOM methods before adding new ones. `/auto-qa` implements/stabilizes
  the actual spec code; here you define the intended cases (endpoint, inputs, expected
  status/shape) carrying the `TC-*` ID in the `test` title.
- A failed API case is captured per **qa-triage** (a spec-level reproduction), not a
  `@triage` feature scenario.

## Inventory revision

You may **add** cases discovered during exploration (new `TC-*` IDs,
`Origin: discovered`) and **mark planned cases N/A** — record the drift in the
deliverable so the plan ↔ manual mapping stays auditable.

## Output

- `deliverables/<feature>/02-Manual-QA.md` — manual validation summary, the case table
  (ID, preconditions, test data, steps, **intended** result, **actual** result, status),
  discovered issues and ambiguities, possible defects, the **existing coverage** found
  per case (which tests already implement it), and the repository updates made
  — plus Review Checklist and Review History.
- **UI**: Gherkin updates in `apps/<app>/features/` (+ any updated existing steps' feature text).
- **API**: spec case definitions in `apps/<app>/specs/api/` (no feature files).

No automation code — POM/SOM/step implementation is `/auto-qa`.
