# /auto-ui

Use `.claude/agents/automation-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/AutomationPlan.md`

Goal:
Implement the approved UI automation in `apps/<app>/` and create
`docs/qa/<app>/AutomationReport.md`.

Rules:
- Only implement approved items from `AutomationPlan.md`.
- **Transcribe, don't invent**: assertions use the **intended** expected values from `TestCases.md` verbatim; carry each `TC-*` ID into the test/scenario title so every test traces to a manual case (no orphans).
- `fail` cases → `@triage` reproduction tests that assert the *intended* result (expected to fail = the repro); `@triage` is excluded from smoke/regression and runs via `npm run test:triage` / `npm run test:bdd:triage`. Do not also tag them `@smoke`/`@regression`.
- Reuse existing feature files, step decorators, Page Objects, fixtures, utilities, and selectors in `apps/<app>/`.
- Add new code only where the automation plan says it is needed.
- Follow `.claude/CLAUDE.md` (POM dual-style + decorators, fixtures registered in both `specs/fixtures.ts` and `steps/fixtures.ts`, `getByRole`/`getByTestId` locators, `@Then … should`, tags).
- Update `docs/qa/<app>/Traceability.md` with each case's automation status + file.
- Validate with `npx tsc --noEmit` and `npm run test:<app>` / `npm run test:bdd:<app>`; provide the run command and a summary.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before implementing (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
3. Read the input artifact: `docs/qa/<app>/AutomationPlan.md`.
4. Validate: requires **Automation Planning = done** (prefer `approved`). If `AutomationPlan.md` is missing or the app isn't `automation-planned`, **stop** and tell the user to run `/auto-plan-ui` first.
5. Read only the relevant `apps/<app>/` source files needed to implement the approved plan. Do not perform a full knowledge review — knowledge files were already used in the planning phases.

After implementing (FINISH):
6. Update `docs/qa/<app>/ProjectState.md` → `Current stage: automated` (Automation row `done`, timestamp, command), and add a History row noting the validation result.
