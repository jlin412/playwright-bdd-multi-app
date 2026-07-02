# /plan-ui

Use `.claude/agents/planning-agent.md` in UI mode. Manage state with
`.claude/agents/workflow-agent.md`.

Input may be (combine any):
- URL (target to plan against)
- existing requirements, test plan, or test cases
- a feature list or functionality description
- a role & rights (permissions) matrix
- screenshots or design files
- source code or app description

First determine the target app `<app>` (the `apps/<name>/` folder, or a slug for a
brand-new target). Build the feature inventory from, in priority order: (1) any
**supplied context** above, (2) a **passive surface scan** of the URL, and (3)
testing knowledge (domain archetypes).

**Passive surface scan (allowed):** load the landing page **once** (Playwright MCP,
`.vscode/mcp.json`, if it's a JS/SPA a plain fetch can't read) and read the
navigation, menus, visible entry points, and `sitemap.xml` to enumerate *what
features exist*. This is **read-only structure discovery** — no clicking through
flows, no login, no form submission, no triggering states, no executing cases. If the
scan is blocked (bot wall, captcha), fall back to archetypes and mark those features
**assumed**. Behavioral recon and execution happen in `/manual-ui`.

Goal:
Create `docs/qa/<app>/TestPlan.md`.

Rules:
- Identify what needs to be tested.
- Include modules, workflows, risks, priorities, assumptions, and open questions.
- List manual test cases that need to be created; give each a stable `TC-<AREA><NN>` ID.
- Prefer supplied context over the scan, and the scan over archetypes; mark scan/archetype-derived features **assumed** so `/manual-ui` confirms them.
- Do not create detailed manual steps.
- Passive **structure** scan only — no behavioral exploration, auth, or execution (that is `/manual-ui`'s job).
- Do not write automation code.

## Workflow protocol (run via `.claude/agents/workflow-agent.md`)

Before planning (START):
1. Read root `CLAUDE.md` and `.claude/CLAUDE.md`.
2. Read the UI knowledge files: `.claude/knowledges/ui-testing.md`, `.claude/knowledges/security-testing.md`, `.claude/knowledges/accessibility-testing.md`, `.claude/knowledges/performance-testing.md`. Use them as checklists to avoid missing test areas.
3. Read `docs/qa/<app>/ProjectState.md` (create it from `.claude/templates/ProjectState.md` if missing; set `Mode: ui`, `Target`).
3. Input: the provided target — Planning is the entry stage, so no prior artifact is required.
5. Validate: if the app is already past `planned`, warn that re-planning marks Manual/Automation `stale`.

After planning (FINISH):
6. Update `docs/qa/<app>/ProjectState.md` → `Current stage: planned` (Planning row `done`, timestamp, command), add a History row, and mark later stages `stale` if they had output.
