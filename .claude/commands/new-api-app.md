# /new-api-app

Scaffold a new **API** app under test (preferably from a Swagger/OpenAPI spec),
then verify it.

Arguments: `$ARGUMENTS`
Expected: an app name plus a Swagger/OpenAPI spec URL and/or a base URL.
Examples:
- `/new-api-app petstore https://petstore.swagger.io/v2/swagger.json`
- `/new-api-app billing https://api.example.com --base https://api.example.com`

Do this:

1. From the arguments, determine:
   - `<name>` — lowercase-hyphen app folder name.
   - a **Swagger/OpenAPI spec URL** (preferred) and/or a **base URL**.
   If the name or a target is missing, ask the user before continuing.
2. Run the generator (non-interactive). It registers the app in `config/apps.ts`,
   adds a `test:<name>` script (API is spec-only — no `test:bdd:<name>`), and writes
   `apps/<name>/.env` + `.env.example`:
   ```bash
   node scripts/new-app.mjs <name> --kind api --yes [--swagger <specUrl>] [--url <baseURL>]
   ```
   With `--swagger`, it fetches the spec, sets `baseURL` to the spec origin,
   saves `apps/<name>/openapi.json`, and generates a SOM + spec tests for the spec's
   no-parameter GET endpoints (no feature files — API is spec-only).
3. Verify and report:
   ```bash
   npx tsc --noEmit
   npm run test:<name>
   ```
   If a generated endpoint smoke fails because the endpoint needs auth or
   parameters, note it — the generator only auto-covers no-parameter GETs.
4. Next steps to share with the user:
   - Extend `apps/<name>/som/<name>.api.ts` with parameterized / auth / write
     (POST/PUT/PATCH/DELETE) endpoints, following `.claude/project/conventions.md` conventions.
   - Run `/test-plan <specUrl>` to start the QA workflow (`/test-plan` → `/manual-qa` →
     `/auto-qa` → `/testops`) under `deliverables/<name>/`.

For a combined UI+API app, run `node scripts/new-app.mjs <name> --kind both …` directly.
