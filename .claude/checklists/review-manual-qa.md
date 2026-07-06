# Manual QA Review Checklist

Step 4 of `/manual-qa`: is `deliverables/<feature>/02-Manual-QA.md` (+ the UI Gherkin /
API spec updates) the specification automation can build on? Displayed ✓/✗ in chat and
mirrored into the deliverable.

- [ ] Every plan `TC-*` is present (or its drift is recorded under Inventory Drift).
- [ ] Each case has preconditions, test data, steps, and an **intended** expected result.
- [ ] Live execution ran the safe, reachable cases — including safe negatives — and recorded the **actual** result + status per case.
- [ ] `fail` cases are tagged `@triage` and listed under Possible Defects.
- [ ] `blocked`/`not-run` cases document the expected behavior instead of a run.
- [ ] Ambiguities and possible defects are recorded with enough detail to reproduce.
- [ ] Each `TC-*` was checked against existing implementations (spec tests + UI BDD features) first; already-implemented cases are recorded under Existing Coverage with a citation and skip re-specifying (but are still live-validated when safe).
- [ ] Coverage is reuse-first: existing feature files, step definitions, and SOM methods extended before new ones created.
- [ ] **API is spec-only** — API cases are specified as `specs/api/` tests (via SOM methods), never an API `.feature` file.
- [ ] UI scenarios without implemented steps are tagged `@manual` (not `@smoke`/`@regression`), so BDD runs stay green.
- [ ] No automation code (POM/SOM/steps implementation is `/auto-qa`).
