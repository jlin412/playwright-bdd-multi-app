# /auto-plan-api

Use `.claude/agents/automation-planning-agent.md` in API mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/TestCases.md`

Goal:
Create `docs/qa/<app>/AutomationPlan.md`.

Rules:
- Do not write automation code.
- Read `.claude/CLAUDE.md`.
- Inspect only the relevant `apps/<app>/` files.
- Decide if each API test is already covered, should be automated, should stay manual, should extend existing `apps/<app>/specs/api` / `features`, or needs a new file.
- Identify reusable Service Objects (`som/*.api.ts`), schemas, fixtures, auth helpers, test data builders, utilities, and tags.
- Identify new assets required and where they belong.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before planning automation (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
3. Read the input artifact: `docs/qa/<app>/TestCases.md`.
4. Validate: requires **Manual Design = done**. If `TestCases.md` is missing or the app isn't `manual-designed`, **stop** and tell the user to run `/manual-api` first.

After planning automation (FINISH):
5. Update `docs/qa/<app>/ProjectState.md` → `Current stage: automation-planned` (Automation Planning row `done`, timestamp, command) and add a History row.
