# /plan-api

Use `.claude/agents/planning-agent.md` in API mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input may be:
- Swagger/OpenAPI URL
- `openapi.json`
- `swagger.yaml`
- backend routes/controllers
- API requirements

First determine the target app `<app>` (the `apps/<name>/` folder, or a slug for
a brand-new target).

Goal:
Create `docs/qa/<app>/TestPlan.md`.

Rules:
- Identify endpoints, resources, auth, roles, data models, and risks.
- List manual API test cases that need to be created.
- Do not create detailed request payloads unless needed for planning.
- Do not write automation code.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before planning (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read `docs/qa/<app>/ProjectState.md` (create it from `.claude/templates/ProjectState.md` if missing; set `Mode: api`, `Target`).
3. Input: the provided spec/target — Planning is the entry stage, so no prior artifact is required.
4. Validate: if the app is already past `planned`, warn that re-planning marks Manual/Automation `stale`.

After planning (FINISH):
5. Update `docs/qa/<app>/ProjectState.md` → `Current stage: planned` (Planning row `done`, timestamp, command), add a History row, and mark later stages `stale` if they had output.
