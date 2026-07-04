# /bootstrap

Run once when adding the toolkit to a new repository, or to refresh conventions after the
stack changes.

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

The portable layers (`skills/`, `checklists/`, `templates/`) are stack-agnostic and are
**not** rewritten here. Do not create tests.
