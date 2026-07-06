# Project Memory — Stack & Framework Facts

Quick-reference for this repo's test framework. Full narrative → root `CLAUDE.md`.
Code-gen conventions → [conventions.md](conventions.md).

## Stack

- **Playwright 1.57 + `playwright-bdd` 8.4 + TypeScript 5.7**, ESM, Node 20.
- One **POM/SOM class layer**: spec (`@playwright/test`) for all coverage; BDD (Gherkin
  via `playwright-bdd`) for **UI only**. API is **spec-only** — no feature files.

## App registry drives everything

- `config/apps.ts` aggregates each `apps/<name>/app.config.ts` (an `AppDescriptor`
  from `lib/app-config.ts`: `{ name, baseURL, ui?, api? }`).
- Both Playwright configs map over the registry to **generate** projects:
  - `playwright.config.ts` (spec) → `api-<name>`, `ui-<name>-<browser>`
  - `playwright.bdd.config.ts` (BDD, **UI apps only**) → one `defineBddConfig` per UI
    app (output `.features-gen/<name>/`, app-scoped `steps` glob) →
    `bdd-ui-<name>-<browser>`. Pure-API apps have no BDD project.
- **Adding an app** = drop `apps/<name>/` (copy `_template`, or run `/new-ui-app` /
  `/new-api-app`) + one import + one array entry in `config/apps.ts`. No config edits.

## Layer roles (per app)

| Layer | Location | Purpose |
|---|---|---|
| POM | `apps/<name>/pom/*.page.ts` | UI interactions; `goto()`, `expectXxx()`, named locators |
| SOM | `apps/<name>/som/*.api.ts` | HTTP checks via `APIRequestContext` |
| Features | `apps/<name>/features/*.feature` | Gherkin (**UI only**) tagged `@smoke`/`@regression`/`@ui`/`@triage` |
| Steps | `apps/<name>/steps/` | `fixtures.ts`, `hooks.ts`, cross-fixture orchestration |
| Workflows | `apps/<name>/specs/e2e/workflows/` | multi-step flows, excluded from smoke |

## URLs decoupled from projects

Page/Service objects navigate with **relative** paths; each app's `baseURL` flows
into its generated projects' `use.baseURL`. Projects encode only browser/style.

## Env

- `lib/load-env.ts` loads root `.env` then every `apps/<name>/.env`
  (`override:false` → real/CI env wins). Imported by both configs before `config/apps`.
- Keys are app-unique/prefixed (one shared process): e.g. `SAUCEDEMO_BASE_URL`,
  `SAUCE_USERNAME`/`SAUCE_PASSWORD`; `PETSTORE_BASE_URL`.
- `<NAME>_BASE_URL` overrides an app's base URL.
- Per-app `.env` is gitignored; `.env.example` is committed. In CI, pass secrets as
  workflow env vars.

## Apps under test

| App | Kind | Target |
|---|---|---|
| `saucedemo` | UI | https://www.saucedemo.com |
| `petstore` | API | https://petstore.swagger.io |
| `_template` | skeleton | copyable; `testIgnore`d, must still type-check |

## Run matrix (key scripts)

- `SMOKE_ONLY=1` excludes `specs/e2e/workflows/**` + `trace-fail` specs, and
  `@fail`/`@tracefail`/`@triage` BDD scenarios.
- Spec: `npm test` · `test:api` · `test:ui` · `test:regression` · `test:<app>`
- BDD (UI only): `npm run test:bdd` · `test:bdd:ui` · `test:bdd:regression` · `test:bdd:<app>` (UI apps)
- Triage (failed-case repros only): `npm run test:triage` · `test:bdd:triage`
- Type-check (CI gate): `npx tsc --noEmit`
- CI sets `forbidOnly`, `retries: 1`; BDD caps `workers: 2`. External targets
  (petstore) can be slow/flaky — prefer `expect.poll`, assert shape over exact counts,
  re-run before declaring a flake a failure.
- CI workflows: `.github/workflows/playwright.yml` is the blocking smoke gate;
  `.github/workflows/testops.yml` runs the smoke + regression matrix on PRs
  (report-only) and posts the release-readiness verdict as a sticky PR comment.

## AI-authoring support

- Playwright MCP server in `.vscode/mcp.json` — live browser recon for `/manual-qa`.
- `apps/<name>/recon/` — one-off exploration scripts to discover real selectors/flows
  before writing POMs. Not part of the test suite; run directly with `node`.
