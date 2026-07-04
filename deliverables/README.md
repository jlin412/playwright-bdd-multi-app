# Deliverables — the durable source of truth

Every v4 workflow stage writes here, **outside `.claude/`**, so its output can be
reviewed, edited, versioned, committed, and resumed later. **Chat history is never
required to continue work** — these files are the record.

One folder per QA work unit (`<feature>` = an app like `petstore`, or a feature slug):

```
deliverables/<feature>/
  01-Test-Plan.md       # /test-plan  — WHAT to test (scenarios, risks, coverage matrix)
  02-Manual-QA.md       # /manual-qa  — live validation + the Gherkin spec for automation
  03-Automation-QA.md   # /auto-qa    — automation coverage report (code lands in apps/<app>/)
  04-TestOps.md         # /testops    — suite execution, flake analysis, release readiness
```

Skeletons live in [`.claude/templates/`](../.claude/templates/). Automation **code** is
not here — it lands in `apps/<app>/` per
[`.claude/project/conventions.md`](../.claude/project/conventions.md); Gherkin lives in
`apps/<app>/features/`.

## Workflow (strictly sequential, no state machine)

```
Requirements → /test-plan → /manual-qa → /auto-qa → /testops
```

- Running the next command **implicitly accepts** the previous stage — there is no
  approval command and no status field. A stage is done when its deliverable exists.
- Each command owns its complete review: it opens the deliverable, shows an Executive
  Summary and Review Checklist, asks review questions one at a time, then loops on open
  feedback (the `qa-review` skill).
- Every deliverable ends with **Executive Summary · Review Checklist · Review History**
  — the Review History table is the audit trail (questions asked, decisions, feedback,
  resolutions).
- `/status` reports each feature's progress from the files alone.
- Re-running a stage command **updates** the existing deliverable and appends to its
  Review History.

## Legacy (v3)

Pre-v4 features live in [`artifacts/`](../artifacts/) (`plan.md`, `manual.md`,
`automation.md` + YAML sidecars). They are kept as a read-only archive; bring a feature
into v4 by running `/test-plan <feature>` (it may mine the old artifacts as supplied
context).
