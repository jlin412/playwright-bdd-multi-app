# /bootstrap

Run once when adding the toolkit to a new repository, to refresh conventions after the
stack changes, or to refresh review calibration from accumulated Review Histories.

**This repo is already bootstrapped** — Project Memory
([`.claude/project/conventions.md`](../project/conventions.md) +
[`.claude/project/stack.md`](../project/stack.md)) is filled in for the Playwright +
`playwright-bdd` stack. Re-run this only to update those values.

Goal: (re)generate `.claude/project/conventions.md` and `.claude/project/stack.md` with
repository-specific facts.

Ask or infer:
- UI automation framework · API automation framework · Language · BDD framework
- Folder structure (features, step definitions, Page Objects, API clients, fixtures/helpers, test data)
- Preferred tags · Preferred locator strategy · Run commands
- Apps under test + their targets, and the env-var scheme

## Review calibration

Distill learned reviewer preferences into
[`.claude/project/review-calibration.md`](../project/review-calibration.md):

1. Scan every Review History table under `deliverables/` (`0*-*.md`,
   `05-Investigations.md`, `_repo/TestOps.md`) for rows whose Decision / Resolution
   starts with `overridden:`.
2. Cluster recurring overrides — two or more pointing the same way become a preference.
3. Write each as: the preference · the evidence rows (feature + date) · how the
   specialists apply it. One-off overrides stay in their Review History only.

The `qa-review` skill applies these instead of re-asking settled questions.

The portable layers (`skills/`, `checklists/`, `templates/`) are stack-agnostic and are
**not** rewritten here. Do not create tests.
