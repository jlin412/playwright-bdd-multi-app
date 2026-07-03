# Playwright + BDD Multi-App Test Template

A generic template for testing **multiple apps** (UI and/or API) with Playwright,
in **two test styles** that share one Page-Object / Service-Object layer:

- **Spec style** — classic `@playwright/test` specs.
- **BDD style** — Gherkin `.feature` files via [`playwright-bdd`](https://vitalets.github.io/playwright-bdd/).

Each app under test lives in a self-contained folder under `apps/<name>/`. Adding
a new app is "drop a folder + register one line" (or run `/new-api-app` / `/new-ui-app`).

## Visual overview

![Playwright + BDD multi-app testing template overview](docs/images/Multi-App_Testing_Framework_Template.png)

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
scripts/new-app.mjs    # scaffold engine (behind /new-api-app and /new-ui-app)
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
# /new-api-app and /new-ui-app add test:<name> + test:bdd:<name> automatically.

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

Use the Claude Code slash commands (in `.claude/commands/`):

```text
/new-api-app petshop https://petstore.swagger.io/v2/swagger.json
/new-ui-app  mystore https://shop.example.com standard_user secret_sauce
```

`/new-api-app` scaffolds an API app (and generates a Service Object from a
Swagger/OpenAPI spec); `/new-ui-app` scaffolds a UI app (home + login POM). Each
command gathers the inputs, runs the generator, and verifies it (`tsc` +
`npm run test:<name>`).

Under the hood they drive the engine `scripts/new-app.mjs`, which you can also
run directly (it prompts when given no flags; `--kind both` makes a combined app):

```bash
node scripts/new-app.mjs petshop --kind api --swagger https://petstore.swagger.io/v2/swagger.json --yes
node scripts/new-app.mjs mystore --kind ui --url https://shop.example.com --username u --password p --yes
node scripts/new-app.mjs            # interactive prompts
```

For each app the generator:
- creates `apps/<name>/` (config, POM/SOM, spec + BDD fixtures, example specs/features);
- writes `apps/<name>/.env` (gitignored) + `.env.example` (committed) with `<NAME>_BASE_URL` and, when given, credentials;
- registers it in `config/apps.ts` and adds `test:<name>` + `test:bdd:<name>` scripts;
- **credentials** → `<NAME>_USERNAME` / `<NAME>_PASSWORD` in `apps/<name>/.env`, plus a `login.page.ts` that reads them (login spec/feature start as `fixme`/`@wip` until you fill in real selectors);
- **Swagger/OpenAPI** → fetches the spec, saves `apps/<name>/openapi.json`, sets the base URL to the spec's origin, and generates a Service Object with methods for the spec's no-parameter GET endpoints plus a passing reachability smoke test.

To add one by hand: copy `apps/_template`, set its `app.config.ts`, and add one
import + array entry to `config/apps.ts`.

## QA Toolkit v3

An **AI-native QA engineering toolkit** ships as Claude Code slash commands. Claude is the
intelligence; the repository is the workflow engine; **artifacts are the source of truth**.
Every stage writes durable files under `artifacts/<feature>/`, so work can be reviewed,
edited, approved, versioned, and resumed later — **chat history is never required**.

![Agentic QA artifact-driven automation pipeline overview](docs/images/Agentic_QA_Automation_Pipeline_Overview.png)

### Architecture (layers)

Reusable expertise is separated from repo-specific memory so the toolkit is portable:

| Layer | Path | Role |
|---|---|---|
| **Commands** | `.claude/commands/` | Thin launchers — orchestration only |
| **Skills** | `.claude/skills/` | Reusable QA methodology (`qa-planning`, `qa-manual-design`, `qa-automation-plan`, `qa-automation`, `qa-triage`, `qa-workflow`) |
| **Checklists** | `.claude/checklists/` | Single-source coverage gates + review checklists |
| **Templates** | `.claude/templates/` | Artifact skeletons (`.md` + `.yaml`) |
| **Project Memory** | `.claude/project/` | This repo's conventions + stack (the only per-repo layer) |
| **Workflow** | `.claude/workflow/` | The six-stage lifecycle + state-derivation rules |
| **Artifacts** | `artifacts/<feature>/` | The durable source of truth (outside `.claude/`) |

Each skill has a paired subagent in `.claude/agents/` for separate-context delegation.
Portable layers (skills / checklists / templates / workflow) can be lifted into another
repo unchanged; only `.claude/project/` is rewritten (`/bootstrap` regenerates it).

### Workflow & review process

```
Planning → review → Manual Testing → review → Automation → review → Execution → Analysis → Improvement
```

Each stage produces a reviewable artifact and advances only past **human approval**:

| Stage | Command (UI · API) | Artifact(s) |
|---|---|---|
| Planning | `/plan-ui` · `/plan-api` | `plan.md` + `plan.yaml` |
| Manual Testing | `/manual-ui` · `/manual-api` | `manual.md` + `manual.yaml` + `execution.md` |
| Automation (design) | `/auto-plan-ui` · `/auto-plan-api` | `automation.md` (Part A) + `automation.yaml` |
| Automation (impl.) | `/auto-ui` · `/auto-api` | `automation.md` (Part B) + code in `apps/<app>/` |
| Execution | `npm run test:<feature>` … | `execution.md` |
| Failure Analysis | (`qa-triage`) | `bugs.md` |
| Improvement | — | `history.md` |

**Review commands** operate purely on the artifacts: `/status` (current stage, blockers,
next command — all derived from files), `/review` (assess against the review checklist →
`in-review`), `/approve` (→ `approved`), `/revise` (→ `draft`, bumps version), `/history`.
A stage moves `draft → in-review → approved`; a `fail` case becomes a `@triage`
reproduction test (out of smoke/regression) logged in `bugs.md`.

### Artifacts & metadata

One folder per QA work unit (`<feature>` = an app like `petstore`, or a feature slug).
Gated stages carry a YAML sidecar (`status`, `owner`, `created`/`updated`, `version`,
`depends_on`, `next_stage`, `approved_by`, `approval_date`) from which workflow **state is
derived** — there is no separate state file. See [artifacts/README.md](artifacts/README.md);
[`artifacts/petstore/`](artifacts/petstore/) is a complete worked example.

### Example run

```text
/plan-api https://petstore.swagger.io/v2/swagger.json   # → artifacts/petstore/plan.md
/review petstore  →  /approve petstore
/manual-api petstore     # runs cases live → manual.md + execution.md
/review petstore  →  /approve petstore
/auto-plan-api petstore  →  review → approve
/auto-api petstore       # writes code in apps/petstore/ + automation.md
/status petstore         # where am I? what's next?
```

For a brand-new target, scaffold first with `/new-ui-app` or `/new-api-app`, then run the
pipeline. Deeper detail lives in each layer's `README` and
[`.claude/workflow/pipeline.md`](.claude/workflow/pipeline.md).

### Migration from v6 (`docs/qa/`)

The earlier toolkit stored per-app docs under `docs/qa/<app>/`. v3 replaces that with the
metadata-driven `artifacts/<feature>/` model:

| v6 `docs/qa/<app>/` | v3 `artifacts/<feature>/` |
|---|---|
| `TestPlan.md` | `plan.md` + `plan.yaml` |
| `TestCases.md` | `manual.md` + `manual.yaml` |
| `TestExecution.md` | `execution.md` |
| `AutomationPlan.md` + `AutomationReport.md` + `Traceability.md` | `automation.md` + `automation.yaml` |
| `ProjectState.md` | derived from the YAML sidecars (+ `history.md`) |

Knowledge previously duplicated across `.claude/knowledges/*` now lives once in
`.claude/checklists/`; automation conventions moved from `.claude/CLAUDE.md` to
`.claude/project/`.

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
