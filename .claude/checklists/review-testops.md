# TestOps Review Checklist

Step 4 of `/testops`: does `deliverables/<feature>/04-TestOps.md` give a trustworthy
quality picture? Displayed ✓/✗ in chat and mirrored into the deliverable.

- [ ] All relevant suites ran: smoke, regression, UI, API, cross-browser where the app has a UI.
- [ ] Every failure has a verdict — product defect · test defect · environment · flake — with evidence.
- [ ] Flakes were confirmed by re-run, not assumed; each has a cause and a fix (applied or recommended).
- [ ] `@triage` repros are reported separately, not counted as suite failures.
- [ ] Coverage is compared against the plan's `TC-*` inventory and the documented gaps; untested high-risk areas are called out.
- [ ] Runtime is reported with any obvious parallelism/duplication wins.
- [ ] The release-readiness verdict (ready / ready-with-risks / not-ready) is stated with its evidence.
- [ ] Framework improvement suggestions are concrete and actionable.
