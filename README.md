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
  features/*.feature   # Gherkin scenarios — UI only (tag @smoke / @regression / @ui)

config/apps.ts         # the app registry — imported by both Playwright configs
lib/app-config.ts      # AppDescriptor type + helpers
playwright.config.ts       # spec projects, generated from the registry
playwright.bdd.config.ts   # one defineBddConfig per UI app, generated from the registry
scripts/new-app.mjs    # scaffold engine (behind /new-api-app and /new-ui-app)
```

**One class layer.** Every POM/SOM class exposes plain helper methods (consumed by
specs) *and* `@Given/@When/@Then` decorators, so a behavior is written once and
reused. **UI** apps run both styles (spec + BDD); **API** coverage is **spec-only**
— an API SOM keeps its decorators only so it can back UI BDD steps, never its own
feature file.

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

# By app (shortcut scripts — UI apps get spec + BDD, API apps spec only)
npm run test:saucedemo            # spec smoke for saucedemo (all 3 browsers)
npm run test:bdd:saucedemo        # BDD for saucedemo
npm run test:petstore             # spec for petstore (spec-only; no BDD)
# (equivalent path filter: npx playwright test apps/<name>)
# /new-ui-app adds test:<name> + test:bdd:<name>; /new-api-app adds test:<name> only.

# By project (browser/style + app)
npx playwright test --project=ui-saucedemo-chromium
npx playwright test --project=api-petstore
npx playwright test -c playwright.bdd.config.ts --project=bdd-ui-saucedemo-firefox

# BDD by tag (UI only)
npm run test:bdd:ui               # @ui scenarios
```

Generated project names follow `ui-<app>-<browser>`, `api-<app>`,
`bdd-ui-<app>-<browser>`. API is spec-only, so there is no `bdd-api-<app>` project.

### Filter BDD by feature and/or tag expression

The per-app BDD scripts (UI apps) accept `--feature <name>` and `--tags "<expr>"`
(full cucumber tag expressions: `and` / `or` / `not` / parens). Pass them after `--`:

```bash
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
cp apps/saucedemo/.env.example apps/saucedemo/.env   # then fill in
```

Because Playwright runs all apps in one process, **keep keys app-unique
(prefixed)** so they don't collide. Per-app keys in use:

- `apps/saucedemo/.env` → `SAUCEDEMO_BASE_URL`, `SAUCE_USERNAME`, `SAUCE_PASSWORD`
- `apps/petstore/.env` → `PETSTORE_BASE_URL`

Other knobs:
- `<NAME>_BASE_URL` — override any app's base URL (also settable as a shell/CI var).
- `SMOKE_ONLY=1` — excludes multi-step `specs/e2e/workflows/**` and `@fail`/`@tracefail` BDD scenarios (set automatically by `npm test` / `npm run test:bdd`).
- In CI, any per-app secrets are set as workflow env vars — they override the (absent) per-app `.env`.

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
- creates `apps/<name>/` (config, POM/SOM, spec + BDD fixtures, example specs; UI apps also get example features — API is spec-only);
- writes `apps/<name>/.env` (gitignored) + `.env.example` (committed) with `<NAME>_BASE_URL` and, when given, credentials;
- registers it in `config/apps.ts` and adds `test:<name>` (plus `test:bdd:<name>` for UI apps);
- **credentials** → `<NAME>_USERNAME` / `<NAME>_PASSWORD` in `apps/<name>/.env`, plus a `login.page.ts` that reads them (login spec/feature start as `fixme`/`@wip` until you fill in real selectors);
- **Swagger/OpenAPI** → fetches the spec, saves `apps/<name>/openapi.json`, sets the base URL to the spec's origin, and generates a Service Object with methods for the spec's no-parameter GET endpoints plus a passing reachability smoke test.

To add one by hand: copy `apps/_template`, set its `app.config.ts`, and add one
import + array entry to `config/apps.ts`.

## QA Toolkit v5

An **AI-native QA engineering toolkit** ships as Claude Code slash commands: four AI
specialists — Test Plan, Manual QA, Automation QA, TestOps — in a simple, strictly
sequential, **review-driven** workflow, plus an on-demand **Bug Investigator**. You act
as the QA Architect and QA Manager; every stage writes a durable deliverable under
`deliverables/<feature>/`, so work can be reviewed, edited, versioned, and resumed
later — **chat history is never required**.

![Agentic QA artifact-driven automation pipeline overview](docs/images/Agentic_QA_Automation_Pipeline_Overview.png)

### Architecture (layers)

Reusable expertise is separated from repo-specific memory so the toolkit is portable:

| Layer | Path | Role |
|---|---|---|
| **Commands** | `.claude/commands/` | Thin launchers — generate, then own the complete review |
| **Skills** | `.claude/skills/` | Reusable QA methodology (`qa-test-plan`, `qa-manual`, `qa-automation`, `qa-testops`, `qa-investigate`, shared `qa-review` + `qa-triage`) |
| **Checklists** | `.claude/checklists/` | Single-source coverage gates + per-stage review checklists |
| **Templates** | `.claude/templates/` | Deliverable skeletons (`01`–`05`) |
| **Project Memory** | `.claude/project/` | This repo's conventions + stack + review calibration (the only per-repo layer) |
| **Deliverables** | `deliverables/<feature>/` | The durable source of truth (outside `.claude/`) |

The five specialist skills have paired subagents in `.claude/agents/` for
separate-context delegation. Portable layers (skills / checklists / templates) can be
lifted into another repo unchanged; only `.claude/project/` is rewritten (`/bootstrap`
regenerates it).

### Workflow (strictly sequential)

```
Requirements → /test-plan → /manual-qa → /auto-qa → /testops
```

There is **no approval command and no state machine** — running the next command
implicitly accepts the previous stage:

| Stage | Command | Specialist mission | Deliverable |
|---|---|---|---|
| 1 | `/test-plan` | WHAT to test — risks, strategy, scenarios, coverage matrix (not automation scope) | `01-Test-Plan.md` |
| 2 | `/manual-qa` | Validate live (Playwright MCP / real HTTP) + write the spec, reuse-first (UI Gherkin / API specs) | `02-Manual-QA.md` + `apps/<app>/features/` (UI) or `specs/api/` (API) |
| 3 | `/auto-qa` | Evaluate **every** case, maximize automation, iterate generate → run → fix until stable | `03-Automation-QA.md` + code in `apps/<app>/` |
| 4 | `/testops` | Run smoke/regression/UI/API/cross-browser; flake + failure analysis; release readiness | `04-TestOps.md` |

On demand (not stages): `/investigate <feature>` root-causes one open defect from
`02-Manual-QA.md § Possible Defects` → `05-Investigations.md`; `/testops repo` assesses
the whole repo with trends from `deliverables/_repo/ledger.md`.

### New in v5

- **Bug Investigator** — `/investigate <feature> [defect]` replays the `@triage` repro
  for fresh evidence, delivers a product/test/environment root-cause verdict, drafts a
  developer-ready bug report, and states the fix-verification contract (repro passes →
  retag `@triage` → `@regression`).
- **Cross-feature TestOps** — `/testops repo` (no per-feature precondition) writes
  `deliverables/_repo/TestOps.md`; **every** `/testops` run appends per-suite rows to
  the append-only `deliverables/_repo/ledger.md`, powering flake-rate + runtime trends.
- **Review calibration** — overridden review recommendations are marked `overridden:`
  in Review History; `/bootstrap` distills recurring ones into
  `.claude/project/review-calibration.md`, which `qa-review` applies instead of
  re-asking settled questions.
- **CI verdict on PRs** — `.github/workflows/testops.yml` runs the smoke + regression
  matrix on every PR (report-only; `playwright.yml` stays the blocking gate) and posts
  the release-readiness verdict as a sticky PR comment.

### The review experience (every command, same pattern)

Each command finishes by **owning the review** of its deliverable (the `qa-review` skill):

1. Opens the deliverable automatically — you never hunt for it.
2. Shows an **Executive Summary** (scenarios, risks, coverage, files changed, results).
3. Shows a **Review Checklist** (✓/✗ against the stage's checklist).
4. Asks review questions **one at a time**, each with a recommendation, the reasoning,
   and the expected impact; your answers are applied to the document immediately.
5. Loops on *"Any additional feedback?"* until you have none — then **stops**. The next
   stage starts only when you run its command.

Every deliverable carries **Executive Summary · Review Checklist · Review History** —
the Review History table is the audit trail of questions, decisions, and resolutions.
A `fail` case becomes a `@triage` reproduction test (out of smoke/regression); scenarios
authored before their steps exist are tagged `@manual` until `/auto-qa` implements them.

### Example run

```text
/test-plan https://petstore.swagger.io/v2/swagger.json  # → deliverables/petstore/01-Test-Plan.md + interactive review
/manual-qa petstore      # validates live, updates API specs (Gherkin is UI-only) → 02-Manual-QA.md + review
/auto-qa petstore        # writes + stabilizes code in apps/petstore/ → 03-Automation-QA.md + review
/testops petstore        # runs the suites → 04-TestOps.md + release verdict + review
/status petstore         # where am I? what's next?

/investigate petstore    # on demand: root-cause an open defect → 05-Investigations.md
/testops repo            # on demand: whole-repo verdict + trends → deliverables/_repo/
```

For a brand-new target, scaffold first with `/new-ui-app` or `/new-api-app`, then run the
workflow. Deeper detail lives in each layer's `README` and
[`deliverables/README.md`](deliverables/README.md).

### Migration from v3 (`artifacts/`)

v3's four-command-pairs + `/review`/`/approve`/`/revise` gates and YAML-sidecar state
machine are replaced by four mode-agnostic commands that each own their review:

| v3 | v4 |
|---|---|
| `/plan-ui` · `/plan-api` → `plan.md` + `plan.yaml` | `/test-plan` → `01-Test-Plan.md` |
| `/manual-ui` · `/manual-api` → `manual.md` + `execution.md` + `bugs.md` | `/manual-qa` → `02-Manual-QA.md` + Gherkin in `apps/<app>/features/` |
| `/auto-plan-*` + `/auto-*` → `automation.md` (Parts A+B) | `/auto-qa` → `03-Automation-QA.md` + code |
| `npm run` execution + failure analysis | `/testops` → `04-TestOps.md` |
| `/review` → `/approve` → `/revise` gates, YAML sidecar state | each command's built-in interactive review; running the next command = acceptance |
| `history.md` + sidecar approval fields | the deliverable's **Review History** section |
| `.claude/workflow/` state-derivation engine | removed — `/status` checks which deliverables exist |

Existing `artifacts/<feature>/` folders (e.g. [`artifacts/petstore/`](artifacts/petstore/))
are kept as a read-only v3 archive; bring a feature into v4 with `/test-plan <feature>`,
pointing it at the old artifacts as supplied context.

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

## Recon / MCP exploration

`apps/<name>/recon/` is where one-off exploration scripts live — used to discover
real selectors and flows before writing page objects (the AI-assisted authoring
loop). Not part of the test suite; run directly with `node`. `.vscode/mcp.json`
wires up the Playwright MCP server for the same workflow.
