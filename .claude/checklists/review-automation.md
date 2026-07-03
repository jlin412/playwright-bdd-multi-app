# Automation Review Checklist

Quality gate for `artifacts/<feature>/automation.md` (+ the generated code) before
`/approve`. Used by `/review`.

- [ ] Every automated test carries its `TC-*` ID — no orphan tests.
- [ ] Assertions reuse the **intended** expected value from `manual.md` verbatim.
- [ ] `pass` → normal test (`@smoke`/`@regression`); `fail` → `@triage` repro (out of smoke/regression).
- [ ] `blocked`/`not-run` → documented gap, not automated.
- [ ] Existing assets reused; new code added only where the plan said.
- [ ] Conventions followed (dual-style POM/SOM, fixtures in **both** fixtures files, relative nav, `getByRole`/`getByLabel`/`getByTestId`, `@Then` "should").
- [ ] Traceability holds **both ways**: no orphans; every `pass`/`fail` case is covered or a documented gap.
- [ ] `tsc` + the relevant tests are green; `automation.yaml` `validation` fields set.
