# /manual-api

Use `.claude/agents/manual-test-agent.md` in API mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/TestPlan.md`

Goal:
Create `docs/qa/<app>/TestCases.md` and update `docs/qa/<app>/Traceability.md`.

Rules:
- Expand the reviewed API test plan into detailed manual API test cases.
- Include endpoint, method, headers, request data, expected status, expected response, validation, priority, risk, and automation candidate.
- Do not write automation code.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before designing (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read the API knowledge files: `.claude/knowledge/api-testing.md`, `.claude/knowledge/security-testing.md`, `.claude/knowledge/performance-testing.md`. Use them to expand planned tests into thorough manual cases.
3. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
4. Read the input artifact: `docs/qa/<app>/TestPlan.md`.
5. Validate: requires **Planning = done**. If `TestPlan.md` is missing or the app isn't `planned`, **stop** and tell the user to run `/plan-api` first.

After designing (FINISH):
6. Update `docs/qa/<app>/ProjectState.md` → `Current stage: manual-designed` (Manual Design row `done`, timestamp, command) and add a History row.
