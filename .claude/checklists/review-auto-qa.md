# Automation QA Review Checklist

Step 4 of `/auto-qa`: is `deliverables/<feature>/03-Automation-QA.md` (+ the generated
code) trustworthy automation? Displayed ✓/✗ in chat and mirrored into the deliverable.

- [ ] **Every** manual case was evaluated; automation was maximized.
- [ ] Every automated test carries its `TC-*` ID — no orphan tests.
- [ ] Assertions reuse the **intended** expected value from `02-Manual-QA.md` verbatim.
- [ ] `pass` → normal test (`@smoke`/`@regression`); `fail` → `@triage` repro (out of smoke/regression); implemented `@manual` scenarios retagged.
- [ ] Every non-automated case has a why + possible approaches + effort + recommendation.
- [ ] Existing assets reused (features, steps, POM/SOM, fixtures, helpers) before new ones created.
- [ ] Conventions followed (dual-style POM/SOM, fixtures in **both** fixtures files, relative nav, `getByRole`/`getByLabel`/`getByTestId`, `@Then` "should").
- [ ] Coverage holds **both ways**: no orphans; every `pass`/`fail` case is covered or an explained gap.
- [ ] The generate → run → fix loop converged: `tsc` + the relevant tests are green (with `@triage` repros failing only on their known defect), and the commands + results are reported.
