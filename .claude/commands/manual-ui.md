# /manual-ui

Use `.claude/agents/manual-test-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input:
- `docs/qa/<app>/TestPlan.md`

Goal:
Create `docs/qa/<app>/TestCases.md`, run the cases live, record results in
`docs/qa/<app>/TestExecution.md`, and update `docs/qa/<app>/Traceability.md`.

Rules:
- Expand the reviewed UI test plan into detailed manual test cases, keeping each plan `TC-*` ID.
- Include preconditions, test data, steps, the **intended** expected result, priority, risk, and automation candidate.
- **Explore and execute the cases live with the Playwright MCP browser** (`.vscode/mcp.json`), bounded to safe, reachable cases (including safe negatives like invalid login). Mark unsafe/unreachable cases `blocked` with documented expected behavior.
- Record the **actual** observed result and a status (`pass`/`fail`/`blocked`/`not-run`) in `TestExecution.md`; a `fail` is a defect → tag the case `@triage`.
- You may add discovered cases (new `TC-*` IDs) and mark planned cases N/A; note the drift in `Traceability.md`.
- Do not write automation code.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before designing (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read the UI knowledge files: `.claude/knowledge/ui-testing.md`, `.claude/knowledge/security-testing.md`, `.claude/knowledge/accessibility-testing.md`, `.claude/knowledge/performance-testing.md`. Use them to expand planned tests into thorough manual cases.
3. Read `docs/qa/<app>/ProjectState.md` (create from template if missing).
4. Read the input artifact: `docs/qa/<app>/TestPlan.md`.
5. Validate: requires **Planning = done**. If `TestPlan.md` is missing or the app isn't `planned`, **stop** and tell the user to run `/plan-ui` first.

After designing & executing (FINISH):
6. Update `docs/qa/<app>/ProjectState.md` → `Current stage: manual-designed` (Manual Design row `done`, timestamp, command; outputs `TestCases.md` + `TestExecution.md`; note run counts — pass/fail/blocked and any `@triage` cases) and add a History row.
