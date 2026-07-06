# App template

Skeleton for a new app under test. The fastest path is a slash command:

```text
/new-api-app <name> <swaggerUrl|baseUrl>      # API app
/new-ui-app  <name> <baseUrl> [user] [pass]   # UI app
```

(They drive `node scripts/new-app.mjs`, which also makes a `--kind both` app.)

That copies this folder to `apps/<name>/`, fills in `app.config.ts`, prunes the
dimension you don't need, and registers the app in `config/apps.ts`.

## What's here

| Path | Purpose |
|---|---|
| `app.config.ts` | App descriptor: `name`, `baseURL`, `ui`/`api`. Drives generated Playwright projects. |
| `pom/example.page.ts` | UI Page Object — relative `goto('/')`, named locators, `@Given/@When/@Then` decorators. |
| `som/example.api.ts` | API Service Object — `APIRequestContext`, readiness polling, decorators (usable in UI BDD steps). |
| `specs/fixtures.ts` | Spec-style fixtures (extends `@playwright/test`). |
| `specs/e2e/*.spec.ts` | Spec-style UI tests. |
| `specs/api/*.spec.ts` | Spec-style API tests — the **only** style for API coverage. |
| `steps/fixtures.ts` | BDD fixtures (extends `playwright-bdd`). |
| `steps/hooks.ts` | BDD `Before`/`After` hooks. |
| `features/*.feature` | Gherkin scenarios (**UI only**); tag `@smoke`, `@regression`, `@ui`. |

## Conventions

- API is **spec-only** — no API feature files. Feature files are for UI behavior.
  A pure-API app has no BDD project; its SOM decorators exist so the service
  object can back UI BDD steps when the app also has a UI.
- POM/SOM classes carry **both** plain helper methods (used by specs) **and**
  `@Given/@When/@Then` decorators (used by UI BDD) — one class, two test styles.
- Keep navigation **relative** (`page.goto('/')`, `request.get('/path')`); the
  base URL comes from the generated project's `use.baseURL`.
- `@Then` step text uses the verb **"should"**; step text is behavior-driven,
  not click-by-click.
