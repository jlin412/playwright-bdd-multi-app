# Plan Review Checklist

Quality gate for `artifacts/<feature>/plan.md` before `/approve`. A review checklist
answers *"is this artifact good enough to advance?"* Used by `/review`.

- [ ] Scope and out-of-scope are explicit.
- [ ] Every module/endpoint from the supplied context and the passive scan is represented.
- [ ] Each planned case has a stable `TC-<AREA><NN>` ID.
- [ ] Risks cover security, accessibility, and performance (cross-checked against those checklists).
- [ ] Assumptions + open questions are captured; scan/archetype-derived features are marked **assumed**.
- [ ] No detailed steps, payloads, or automation code (those are later phases).
- [ ] `plan.yaml`: `mode` + `target` set; `status`/`owner` correct.
