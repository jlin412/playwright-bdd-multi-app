# App template

Skeleton for a new app under test. The fastest path is the scaffold script:

```bash
npm run new:app -- <name> --kind ui|api|both --url <baseURL>
```

That copies this folder to `apps/<name>/`, fills in `app.config.ts`, prunes the
dimension you don't need, and registers the app in `config/apps.ts`.

## What's here

| Path | Purpose |
|---|---|
| `app.config.ts` | App descriptor: `name`, `baseURL`, `ui`/`api`. Drives generated Playwright projects. |
| `pom/example.page.ts` | UI Page Object — relative `goto('/')`, named locators, `@Given/@When/@Then` decorators. |
| `som/example.api.ts` | API Service Object — `APIRequestContext`, readiness polling, decorators. |
| `specs/fixtures.ts` | Spec-style fixtures (extends `@playwright/test`). |
| `specs/e2e/*.spec.ts` | Spec-style UI tests. |
| `specs/api/*.spec.ts` | Spec-style API tests. |
| `steps/fixtures.ts` | BDD fixtures (extends `playwright-bdd`). |
| `steps/hooks.ts` | BDD `Before`/`After` hooks. |
| `features/*.feature` | Gherkin scenarios; tag `@smoke`, `@regression`, `@ui`, `@api`. |

## Conventions

- POM/SOM classes carry **both** plain helper methods (used by specs) **and**
  `@Given/@When/@Then` decorators (used by BDD) — one class, two test styles.
- Keep navigation **relative** (`page.goto('/')`, `request.get('/path')`); the
  base URL comes from the generated project's `use.baseURL`.
- `@Then` step text uses the verb **"should"**; step text is behavior-driven,
  not click-by-click.
