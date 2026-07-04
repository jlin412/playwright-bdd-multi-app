# Test Plan Review Checklist

Step 4 of `/test-plan`: is `deliverables/<feature>/01-Test-Plan.md` good enough to build
on? Displayed ✓/✗ in chat and mirrored into the deliverable; an ✗ is fixed immediately
or becomes an interactive-review question.

- [ ] Scope and out-of-scope are explicit.
- [ ] Every module/endpoint from the supplied context and the passive scan is represented.
- [ ] Each scenario has a stable `TC-<AREA><NN>` ID.
- [ ] The coverage matrix maps every requirement/feature to its `TC-*` scenarios; gaps are explicit.
- [ ] Risks cover security, accessibility, and performance (cross-checked against those checklists).
- [ ] Priorities reflect the risk assessment.
- [ ] Assumptions + open questions are captured; scan/archetype-derived features are marked **assumed**.
- [ ] No detailed steps, payloads, automation decisions, or code (those are later stages).
