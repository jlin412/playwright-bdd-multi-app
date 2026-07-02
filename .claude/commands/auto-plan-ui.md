# /auto-plan-ui

Use `.claude/agents/automation-planning-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/TestCases.md`
- `docs/qa/<app>/TestExecution.md`

Goal:
Create `docs/qa/<app>/AutomationPlan.md`.

Rules:
- Do not write automation code.
- Read `.claude/CLAUDE.md`.
- Inspect only the relevant `apps/<app>/` files.
- **Gate by execution status**: automate `pass` cases (normal tests) and `fail` cases (`@triage` reproduction tests asserting the *intended* result, excluded from smoke/regression); do not automate `blocked`/`not-run` — list them as documented gaps.
- Keep automation **1:1 aligned** with `TC-*` cases: every planned test traces to a case ID; invent no test without a manual parent.
- Assertions reuse the **intended** expected values from `TestCases.md` verbatim (never the buggy observed value).
- Decide per case: already covered, extend an existing `apps/<app>/features/*.feature` (new scenario) or POM, or a new feature/spec.
- Identify reusable feature files, step decorators, Page Objects, fixtures, utilities, selectors, and tags; identify new assets and where they belong.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before planning automation (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read the UI knowledge files: `.claude/knowledges/ui-testing.md`, `.claude/knowledges/security-testing.md`, `.claude/knowledges/accessibility-testing.md`, `.claude/knowledges/performance-testing.md`. Use them to identify coverage gaps and assess automation candidacy.
3. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
4. Read the input artifacts: `docs/qa/<app>/TestCases.md` and `docs/qa/<app>/TestExecution.md`.
5. Validate: requires **Manual Design = done**. If `TestCases.md`/`TestExecution.md` are missing or the app isn't `manual-designed`, **stop** and tell the user to run `/manual-ui` first.

After planning automation (FINISH):
6. Update `docs/qa/<app>/ProjectState.md` → `Current stage: automation-planned` (Automation Planning row `done`, timestamp, command) and add a History row.
