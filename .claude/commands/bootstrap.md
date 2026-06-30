# /bootstrap

Use this command once when adding the toolkit to a new repository, or to refresh
the conventions after the stack changes.

**This repo is already bootstrapped** — `.claude/CLAUDE.md` is filled in with the
Playwright + `playwright-bdd` conventions (framework, `apps/<app>/` folder
structure, standards, run commands). Re-run this only to update those values.

Goal:
Update `.claude/CLAUDE.md` with repository-specific conventions.

Ask or infer:
- UI automation framework
- API automation framework
- Language
- BDD framework
- Folder structure (feature files, step definitions, Page Objects, API clients, fixtures/helpers, test data)
- Preferred tags
- Preferred locator strategy
- Run commands

Do not create tests.
