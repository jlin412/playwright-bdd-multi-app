# Manual Review Checklist

Quality gate for `artifacts/<feature>/manual.md` + `execution.md` before `/approve`.
Used by `/review`.

- [ ] Every plan `TC-*` is present (or the drift is noted in `history.md`).
- [ ] Each case has preconditions, test data, steps, and an **intended** expected result.
- [ ] Live execution ran the safe, reachable cases — including safe negatives.
- [ ] `execution.md` records the **actual** observed result + a status per case.
- [ ] `fail` cases are tagged `@triage` and logged in `bugs.md`.
- [ ] `blocked`/`not-run` cases document the expected behavior instead of a run.
- [ ] No automation code.
- [ ] `manual.yaml` run summary matches `execution.md`.
