# /new-ui-app

Scaffold a new **UI** app under test from a base URL (optionally with test
credentials), then verify it.

Arguments: `$ARGUMENTS`
Expected: an app name plus a base URL, optionally a username and password.
Examples:
- `/new-ui-app shop https://www.saucedemo.com`
- `/new-ui-app shop https://www.saucedemo.com standard_user secret_sauce`

Do this:

1. From the arguments, determine:
   - `<name>` — lowercase-hyphen app folder name.
   - the **base URL**, and optional **username** / **password**.
   If the name or base URL is missing, ask the user before continuing.
2. Run the generator (non-interactive). It generates a home + login POM, writes
   `apps/<name>/.env` + `.env.example`, registers the app in `config/apps.ts`,
   and adds `test:<name>` / `test:bdd:<name>` scripts:
   ```bash
   node scripts/new-app.mjs <name> --kind ui --url <baseURL> --yes [--username <u> --password <p>]
   ```
   The login spec/feature start as `test.fixme` / `@wip` until real selectors are added.
3. Verify and report:
   ```bash
   npx tsc --noEmit
   npm run test:<name>
   ```
   Expect the home smoke to pass; the login test is skipped (`fixme`) by design.
4. Next steps to share with the user:
   - Replace the placeholder selectors in `apps/<name>/pom/login.page.ts`, then
     remove `.fixme` and re-tag the login feature `@smoke`. Discover real
     selectors with the Playwright MCP (`.vscode/mcp.json`) or an
     `apps/<name>/recon/` script. See `.claude/project/conventions.md` for conventions.
   - Run `/plan-ui <url>` to start the QA pipeline (plan → manual → auto) under `artifacts/<name>/`.

For a combined UI+API app, run `node scripts/new-app.mjs <name> --kind both …` directly.
