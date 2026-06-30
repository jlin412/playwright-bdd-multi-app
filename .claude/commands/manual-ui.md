# /manual-ui

Use `.claude/agents/manual-test-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/TestPlan.md`

Goal:
Create `docs/qa/<app>/TestCases.md` and update `docs/qa/<app>/Traceability.md`.

Rules:
- Expand the reviewed UI test plan into detailed manual test cases.
- Include preconditions, test data, steps, expected results, priority, risk, and automation candidate.
- Do not write automation code.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before designing (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
3. Read the input artifact: `docs/qa/<app>/TestPlan.md`.
4. Validate: requires **Planning = done**. If `TestPlan.md` is missing or the app isn't `planned`, **stop** and tell the user to run `/plan-ui` first.

After designing (FINISH):
5. Update `docs/qa/<app>/ProjectState.md` → `Current stage: manual-designed` (Manual Design row `done`, timestamp, command) and add a History row.
