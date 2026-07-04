# Artifacts — legacy v3 archive

**This layout is superseded.** The QA Toolkit v4 writes its deliverables to
[`deliverables/<feature>/`](../deliverables/README.md)
(`01-Test-Plan.md` → `02-Manual-QA.md` → `03-Automation-QA.md` → `04-TestOps.md`,
produced by `/test-plan` → `/manual-qa` → `/auto-qa` → `/testops`).

The folders here (`artifacts/<feature>/` with `plan.md`, `manual.md`, `execution.md`,
`automation.md`, `bugs.md`, `history.md` + YAML sidecars) are the v3 pipeline's output,
kept as a **read-only archive** — [`petstore/`](petstore/) is a complete worked example
of that era. Nothing writes here anymore.

To continue QA on one of these features, run `/test-plan <feature>` and point it at the
old artifacts as supplied context — the v3 → v4 mapping is documented in the root
`README.md` § "Migration from v3".
