# Playwright + BDD Multi-App Test Template

A generic template for testing **multiple apps** (UI and/or API) with Playwright,
in **two test styles** that share one Page-Object / Service-Object layer:

- **Spec style** — classic `@playwright/test` specs.
- **BDD style** — Gherkin `.feature` files via [`playwright-bdd`](https://vitalets.github.io/playwright-bdd/).

Each app under test lives in a self-contained folder under `apps/<name>/`. Adding
a new app is "drop a folder + register one line" (or run `npm run new:app`).

## Bundled example apps

| App | Kind | Target | Shows |
|---|---|---|---|
| `apps/saucedemo` | UI | https://www.saucedemo.com | Login, cart, full checkout across chromium/firefox/webkit |
| `apps/petstore` | API | https://petstore.swagger.io | Create/fetch pet, find-by-status, store inventory |
| `apps/yosemitecinema` | UI + API | https://www.yosemitecinema.com | A richer real-world suite (browsing, auth, ticketing, payment) |

## How it fits together

```
apps/<name>/
  app.config.ts        # { name, baseURL, ui?, api? } — drives generated projects
  pom/*.page.ts        # UI Page Objects   (spec helpers + @Given/@When/@Then)
  som/*.api.ts         # API Service Objects (spec helpers + @Given/@When/@Then)
  specs/fixtures.ts    # spec-style fixtures (extends @playwright/test)
  specs/e2e/*.spec.ts  # spec-style UI tests
  specs/api/*.spec.ts  # spec-style API tests
  steps/fixtures.ts    # BDD fixtures (extends playwright-bdd)
  steps/hooks.ts       # BDD Before/After
  features/*.feature   # Gherkin scenarios (tag @smoke / @regression / @ui / @api)

config/apps.ts         # the app registry — imported by both Playwright configs
lib/app-config.ts      # AppDescriptor type + helpers
playwright.config.ts       # spec projects, generated from the registry
playwright.bdd.config.ts   # one defineBddConfig per app, generated from the registry
scripts/new-app.mjs    # scaffolds a new app from apps/_template
```

**One class layer, two styles.** Every POM/SOM class exposes plain helper methods
(consumed by specs) *and* `@Given/@When/@Then` decorators (consumed by BDD), so a
behavior is written once and reused by both styles.

**URLs are decoupled from projects.** Page/Service objects navigate with *relative*
paths (`page.goto('/')`, `request.get('/path')`). Each app's `baseURL` flows into
its generated Playwright projects' `use.baseURL`, so projects only encode the
browser/style dimension — never the target URL.

## Setup

```bash
npm install
npx playwright install            # all browsers (chromium/firefox/webkit)
```

## Run

```bash
# Everything (smoke)
npm test                          # spec-style smoke, all apps
npm run test:bdd                  # BDD smoke, all apps (runs bddgen first)

# By style
npm run test:api                  # all API spec tests
npm run test:ui                   # all UI spec tests (smoke)
npm run test:regression           # all UI spec tests incl. multi-step workflows

# By app (shortcut scripts — one per app, spec + BDD)
npm run test:saucedemo            # spec smoke for saucedemo (all 3 browsers)
npm run test:bdd:saucedemo        # BDD for saucedemo
npm run test:petstore             # spec for petstore
npm run test:bdd:petstore         # BDD for petstore
npm run test:yosemitecinema
npm run test:bdd:yosemitecinema
# (equivalent path filter: npx playwright test apps/<name>)
# `npm run new:app` adds test:<name> + test:bdd:<name> automatically.

# By project (browser/style + app)
npx playwright test --project=ui-saucedemo-chromium
npx playwright test --project=api-petstore
npx playwright test -c playwright.bdd.config.ts --project=bdd-ui-saucedemo-firefox

# BDD by tag
npm run test:bdd:ui               # @ui scenarios
npm run test:bdd:api              # @api scenarios
```

Generated project names follow `ui-<app>-<browser>`, `api-<app>`,
`bdd-ui-<app>-<browser>`, `bdd-api-<app>`.

### Filter BDD by feature and/or tag expression

The per-app BDD scripts accept `--feature <name>` and `--tags "<expr>"` (full
cucumber tag expressions: `and` / `or` / `not` / parens). Pass them after `--`:

```bash
npm run test:bdd:petstore -- --feature pet            # only pet.feature
npm run test:bdd:petstore -- --tags "@smoke and @api" # tag expression
npm run test:bdd:saucedemo -- --feature checkout      # a @regression feature
npm run test:bdd:saucedemo -- --feature login --tags "@smoke" --headed
npm run bdd -- --tags "@ui and not @regression"       # across all apps
```

Tag generation rules: `--tags` is passed straight to `bddgen`; if you give only
`--feature`, generation broadens to `not @tracefail` (so non-`@smoke` features
are available); with neither, it's the default `@smoke` set. Anything else after
`--` (e.g. `--headed`, `--debug`, `--workers=1`) is forwarded to Playwright.

### Environment

Each app has its **own** `apps/<name>/.env` (gitignored), plus a committed
`apps/<name>/.env.example` documenting its keys. `lib/load-env.ts` loads the root
`.env` first (shared/fallback) then every `apps/<name>/.env`; real environment /
CI variables always win. Copy the example to start:

```bash
cp apps/yosemitecinema/.env.example apps/yosemitecinema/.env   # then fill in
```

Because Playwright runs all apps in one process, **keep keys app-unique
(prefixed)** so they don't collide. Per-app keys in use:

- `apps/saucedemo/.env` → `SAUCEDEMO_BASE_URL`, `SAUCE_USERNAME`, `SAUCE_PASSWORD`
- `apps/petstore/.env` → `PETSTORE_BASE_URL`
- `apps/yosemitecinema/.env` → `YOSEMITECINEMA_BASE_URL`, `TEST_MEMBER_EMAIL`, `TEST_MEMBER_PASSWORD`

Other knobs:
- `<NAME>_BASE_URL` — override any app's base URL (also settable as a shell/CI var).
- `SMOKE_ONLY=1` — excludes multi-step `specs/e2e/workflows/**` and `@fail`/`@tracefail` BDD scenarios (set automatically by `npm test` / `npm run test:bdd`).
- In CI, set secrets (e.g. `TEST_MEMBER_EMAIL/PASSWORD`) as workflow env vars — they override the (absent) per-app `.env`.

## Add a new app

Run the generator with no arguments for an interactive wizard:

```bash
npm run new:app
#   App name (lowercase-hyphen): mystore
#   Kind [ui/api/both] (both): api
#   Base / test URL (https://example.com): https://api.example.com
#   Swagger/OpenAPI spec URL (blank to skip): https://api.example.com/openapi.json
```

It prompts for the test URL, test user credentials (UI), and a Swagger/OpenAPI
spec URL (API). Or pass everything as flags (CI-friendly, add `--yes`):

```bash
npm run new:app -- mystore --kind ui  --url https://shop.example.com \
  --username standard_user --password secret_sauce --yes
npm run new:app -- petshop --kind api --swagger https://petstore.swagger.io/v2/swagger.json --yes
```

For each app it:
- creates `apps/<name>/` (config, POM/SOM, spec + BDD fixtures, example specs/features);
- writes `apps/<name>/.env` (gitignored) + `.env.example` (committed) with `<NAME>_BASE_URL` and, when given, credentials;
- registers it in `config/apps.ts` and adds `test:<name>` + `test:bdd:<name>` scripts;
- **credentials** → `<NAME>_USERNAME` / `<NAME>_PASSWORD` in `apps/<name>/.env`, plus a `login.page.ts` that reads them (login spec/feature start as `fixme`/`@wip` until you fill in real selectors);
- **Swagger/OpenAPI** → fetches the spec, saves `apps/<name>/openapi.json`, sets the base URL to the spec's origin, and generates a Service Object with methods for the spec's no-parameter GET endpoints plus a passing reachability smoke test.

To add one by hand: copy `apps/_template`, set its `app.config.ts`, and add one
import + array entry to `config/apps.ts`.

## Reports

```bash
npm run report                    # Playwright HTML report
npm run report:bdd:html           # Cucumber HTML report
```

Outputs: `playwright-report/`, `cucumber-report/`, `test-results/`. Traces and
screenshots are retained on failure (`trace: retain-on-failure`).

## Notes on the example targets

- **SauceDemo / PetStore** are public demo services — no local stack required.
- **PetStore** (`petstore.swagger.io`) is a shared, mutable sandbox; its tests assert response *shape* and a create→fetch round-trip rather than exact counts, with readiness polling. CI `retries: 1` covers transient flakiness.
- **yosemitecinema** is a live external site — its config uses generous timeouts and caps BDD workers at 2.

## Recon / MCP exploration

`apps/yosemitecinema/recon/` holds the exploration scripts used to discover real
selectors and flows before writing page objects (the AI-assisted authoring loop).
`.vscode/mcp.json` wires up the Playwright MCP server for the same workflow.
