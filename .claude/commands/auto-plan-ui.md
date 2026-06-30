# /auto-plan-ui

Use `.claude/agents/automation-planning-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/TestCases.md`

Goal:
Create `docs/qa/<app>/AutomationPlan.md`.

Rules:
- Do not write automation code.
- Read `.claude/CLAUDE.md`.
- Inspect only the relevant `apps/<app>/` files.
- Decide if each test is already covered, should be automated, should stay manual, should extend an existing `apps/<app>/features/*.feature` (new scenario) or POM, or needs a new feature/spec.
- Identify reusable feature files, step decorators, Page Objects, fixtures, utilities, selectors, and tags.
- Identify new assets required and where they belong.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before planning automation (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read the UI knowledge files: `.claude/knowledge/ui-testing.md`, `.claude/knowledge/security-testing.md`, `.claude/knowledge/accessibility-testing.md`, `.claude/knowledge/performance-testing.md`. Use them to identify coverage gaps and assess automation candidacy.
3. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
4. Read the input artifact: `docs/qa/<app>/TestCases.md`.
5. Validate: requires **Manual Design = done**. If `TestCases.md` is missing or the app isn't `manual-designed`, **stop** and tell the user to run `/manual-ui` first.

After planning automation (FINISH):
6. Update `docs/qa/<app>/ProjectState.md` → `Current stage: automation-planned` (Automation Planning row `done`, timestamp, command) and add a History row.
