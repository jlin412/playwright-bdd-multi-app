# Investigation Review Checklist

Step 4 of `/investigate`: does this investigation in
`deliverables/<feature>/05-Investigations.md` close the defect credibly? Displayed ✓/✗
in chat and mirrored into the deliverable.

- [ ] The `@triage` repro was re-run for this investigation — the evidence is fresh, not recalled.
- [ ] The root-cause verdict (product · test · environment) is stated with the evidence that rules out the other two.
- [ ] The hypothesis was verified by a second targeted probe, not inferred from a single failure.
- [ ] Severity is justified, not asserted.
- [ ] The bug report is developer-ready: minimal numbered repro steps, intended vs actual, evidence paths, suspected cause.
- [ ] The fix-verification contract is explicit: which test flips, then the `qa-triage` retag rule applies.
- [ ] The defect's row in `02-Manual-QA.md § Possible Defects` was updated (status + link to the investigation).
