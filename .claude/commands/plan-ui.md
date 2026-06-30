# /plan-ui

Use `.claude/agents/planning-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input may be:
- URL
- requirements
- story
- screenshots
- source code
- app description

First determine the target app `<app>` (the `apps/<name>/` folder, or a slug for
a brand-new target). For a live URL, you may explore with the Playwright MCP
(`.vscode/mcp.json`) or an `apps/<app>/recon/` script.

Goal:
Create `docs/qa/<app>/TestPlan.md`.

Rules:
- Identify what needs to be tested.
- Include modules, workflows, risks, priorities, assumptions, and open questions.
- List manual test cases that need to be created.
- Do not create detailed manual steps.
- Do not write automation code.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before planning (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read `docs/qa/<app>/ProjectState.md` (create it from `.claude/templates/ProjectState.md` if missing; set `Mode: ui`, `Target`).
3. Input: the provided target — Planning is the entry stage, so no prior artifact is required.
4. Validate: if the app is already past `planned`, warn that re-planning marks Manual/Automation `stale`.

After planning (FINISH):
5. Update `docs/qa/<app>/ProjectState.md` → `Current stage: planned` (Planning row `done`, timestamp, command), add a History row, and mark later stages `stale` if they had output.
