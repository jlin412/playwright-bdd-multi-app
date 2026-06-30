# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **multi-app** Playwright + `playwright-bdd` template. Each app under test lives
in `apps/<name>/` and is exercised in two styles (spec + BDD) from one POM/SOM
class layer. Bundled apps: `saucedemo` (UI), `petstore` (API), `yosemitecinema`
(UI + API). See `README.md` for the user-facing overview.

## Commands

```bash
npm install
npx playwright install                 # all browsers (chromium/firefox/webkit)

# Spec style
npm test                               # smoke, all apps
npm run test:api                       # all API spec tests (path filter: specs/api)
npm run test:ui                        # all UI spec tests, smoke (path filter: specs/e2e)
npm run test:regression                # UI specs incl. specs/e2e/workflows/**

# BDD style (generates .features-gen/<app>/ first, then runs Playwright)
npm run test:bdd                       # smoke, all apps
npm run test:bdd:ui                    # @ui scenarios
npm run test:bdd:api                   # @api scenarios
npm run test:bdd:regression            # includes @regression

# Scope to one app (per-app shortcuts; new:app generates these)
npm run test:<app>                     # spec smoke for one app
npm run test:bdd:<app>                 # BDD for one app (via scripts/bdd.mjs)

# Filter BDD by feature / tag expression (args after --)
npm run test:bdd:petstore -- --feature pet
npm run test:bdd:petstore -- --tags "@smoke and @api"
npm run bdd -- --tags "@ui and not @regression"   # all apps

# Or use raw Playwright filters
npx playwright test apps/saucedemo
npx playwright test --project=api-petstore
npx playwright test -c playwright.bdd.config.ts --project=bdd-ui-saucedemo-webkit

# Scaffold a new app (interactive wizard, or flags + --yes for CI)
npm run new:app                        # prompts: name, kind, URL, creds, swagger URL
npm run new:app -- <name> --kind ui|api|both --url <baseURL> \
  [--username <u> --password <p>] [--swagger <specUrl>] [--yes]

# Interactive / debug
npm run debug:ui                       # Playwright Test UI (spec style)
npm run debug:bdd:ui                   # Playwright Test UI (BDD style, runs bddgen first)

# Type-check (CI gate)
npx tsc --noEmit

# Reports
npm run report                         # Playwright HTML
npm run report:bdd:html                # Cucumber HTML
```

## Architecture

### App registry drives everything

`config/apps.ts` aggregates each `apps/<name>/app.config.ts` (an `AppDescriptor`
from `lib/app-config.ts`: `{ name, baseURL, ui?, api? }`). Both Playwright configs
map over the registry to **generate projects** — adding an app needs no config edits
beyond registering it:

- `playwright.config.ts` (spec) → `api-<name>` and `ui-<name>-<browser>` projects, routed by `testMatch` on `apps/<name>/specs/{api,e2e}/`.
- `playwright.bdd.config.ts` (BDD) → **one `defineBddConfig` per app** (output `.features-gen/<name>/`, app-scoped `steps` glob) → `bdd-ui-<name>-<browser>` or `bdd-api-<name>` projects.

Per-app `defineBddConfig` is what lets each app keep its own `steps/fixtures.ts`:
each config's `steps` glob sees exactly one `test` instance + one decorated class set.

Routing rule: an app with `ui` runs its BDD suite as **browser** projects; a pure-`api`
app runs it as an **API** project. (An app needing both UI and API BDD would split
features into `features/ui` + `features/api` and add matching projects.)

### URLs are decoupled from projects

Page/Service objects navigate with **relative** paths (`page.goto('/')`,
`request.get('/path')`). Each app's `baseURL` flows into its generated projects'
`use.baseURL`. Projects encode only browser/style — never the target URL. If an API
has a base path (e.g. PetStore's `/v2`), put the origin in `baseURL` and the prefix
on the endpoint paths, because a leading-slash path resolves against the origin.

### Two parallel test styles, one shared class layer

Every POM/SOM class is annotated with both Playwright fixture types and
`playwright-bdd` decorators, so the same class drives both styles:

- **Spec tests** import from `apps/<name>/specs/fixtures.ts` (extends `@playwright/test`'s `base`).
- **BDD tests** import from `apps/<name>/steps/fixtures.ts` (extends `playwright-bdd`'s `base`); step definitions come from `@Given`/`@When`/`@Then` decorators on the POM/SOM methods.

Both fixtures files instantiate the same classes; adding a class means updating both.

### Layer roles (within an app)

| Layer | Location | Purpose |
|---|---|---|
| POM | `apps/<name>/pom/*.page.ts` | UI interactions; `goto()`, `expectXxx()`, named locators |
| SOM | `apps/<name>/som/*.api.ts` | HTTP checks via `APIRequestContext` |
| BDD features | `apps/<name>/features/*.feature` | Gherkin tagged `@smoke`/`@regression`/`@ui`/`@api`/`@fail` |
| BDD steps | `apps/<name>/steps/fixtures.ts`, `hooks.ts` | fixture wiring + Before/After; step impls live on POM/SOM |
| Workflow specs | `apps/<name>/specs/e2e/workflows/` | multi-step flows, excluded from smoke via `SMOKE_ONLY=1` |

`bddgen` compiles `.feature` files into `.features-gen/<name>/` — generated, never
edit by hand. The `test:bdd*` scripts run it automatically.

### Env / config

- **Per-app env**: each app has `apps/<name>/.env` (gitignored) + `apps/<name>/.env.example` (committed). `lib/load-env.ts` (imported by both configs *before* `config/apps`) loads root `.env` then every `apps/<name>/.env`; real/CI env wins (`override: false`). Keys are app-unique/prefixed (one shared process) — e.g. `SAUCEDEMO_BASE_URL`+`SAUCE_USERNAME`/`SAUCE_PASSWORD`, `YOSEMITECINEMA_BASE_URL`+`TEST_MEMBER_EMAIL`/`TEST_MEMBER_PASSWORD`.
- `<NAME>_BASE_URL` overrides an app's base URL; read by `apps/<name>/app.config.ts`.
- `SMOKE_ONLY=1` excludes `specs/e2e/workflows/**` + `trace-fail` specs, and `@fail`/`@tracefail` BDD scenarios.
- CI sets `forbidOnly`, `retries: 1`; BDD caps workers at 2. In CI, pass secrets as workflow env vars (they override the absent per-app `.env`).

### Supporting directories

- `bdd/cucumber-reporter.cjs` — custom Cucumber HTML reporter wired into `playwright.bdd.config.ts`; outputs to `cucumber-report/`.
- `mcp/playwright-mcp-server.mjs` — MCP server for AI-assisted test authoring (see `.vscode/mcp.json`). Exposes tools to list/generate test files from a page path.
- `apps/<name>/recon/` — one-off exploration scripts used to discover real selectors and app flows before writing POMs (AI authoring loop). Not part of the test suite; run directly with `node`.

## Adding an app

`npm run new:app -- <name> --kind ui|api|both --url <baseURL>` copies `apps/_template`,
fills `app.config.ts`, prunes the unused dimension, writes kind-appropriate
fixtures/feature, and registers the app in `config/apps.ts`. `apps/_template` is
excluded from runs (`testIgnore`) but must still type-check.

## Conventions

### BDD file naming

Files in `apps/<name>/features/` and `apps/<name>/steps/` are **named by
behavior/functionality**, never by workflow letter. `steps/` holds only
`fixtures.ts`, `hooks.ts`, and cross-fixture orchestration step files (e.g.
`checkout-setup.steps.ts`). Single-fixture steps live as decorators on the POM class.

### POM structure (three sections)

Each POM is organized as (see `apps/yosemitecinema/pom/auth.page.ts` for the reference):

```
// ── Assertions ──────────────  → non-decorated expectXxx() helpers
// ── Actions ─────────────────  → non-decorated action helpers (goto, click, fill…)
// ── BDD step decorators ─────  → @Given/@When/@Then methods that are thin wrappers
```

- Action helpers **may include action-confirmation assertions** about the element being acted on. By design.
- Test-case-logic assertions (what the scenario verifies) belong in a separate `@Then` calling an `expectXxx()` helper.
- Specs consume the non-decorated helpers directly — keep that API surface stable.

### BDD step text style

Behavior/intention-driven, not click-by-click. Prefer `When I log in as a member`
over three granular steps. All `@Then` step texts **must use the verb "should"**:
`Then the products page should be visible` ✓ / `Then the products page is visible` ✗.

For multi-step setup that isn't itself the test, use a composite `@Given` in a
`steps/*.steps.ts` orchestration file rather than a long `Background` of granular steps.

### Feature file structure rules

- **Single-scenario feature**: no `Background` — inline the setup steps.
- **Given vs When**: if a scenario has no `When` of its own, write its `Given` as `When` (unless the `Background` already contains a `When`).

### Pre-merge checklist

```bash
npx tsc --noEmit                       # type-check
npm test                               # spec smoke (all apps)
npm run test:bdd                       # BDD smoke (all apps)
npm run test:bdd:regression            # full BDD regression
```

All must be green. External targets (yosemitecinema, petstore) can be slow/flaky —
prefer `expect.poll` and generous timeouts; assert shape over exact counts; re-run
before declaring a flake a failure.
