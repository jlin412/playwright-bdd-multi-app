---
name: qa-test-plan
description: Determine WHAT needs to be tested — analyze requirements, identify risks, create the testing strategy, scenario inventory, coverage matrix, and priorities. No manual steps, no automation decisions, no code. Used by /test-plan. Writes deliverables/<feature>/01-Test-Plan.md.
---

# Test Plan skill

Mission: determine **what** needs to be tested. Structure and strategy only — discover
*what features exist and what could go wrong*, not how the app behaves (that is
`qa-manual`) and not what gets automated (that is `qa-automation` — do **not** decide
automation scope here).

**Compose, don't restate:**
- Coverage → the mode's checklists (map in `.claude/project/conventions.md`); mode is
  `UI`, `API`, or both — infer it from the target and supplied context.
- Output shape → `.claude/templates/01-test-plan.md`.
- Review → the `/test-plan` command runs the `qa-review` protocol after this skill.

## Sources (priority order)

1. **Supplied context** — requirements, an existing plan/cases, a feature list,
   functionality description, role & rights matrix, screenshots, files, Swagger/OpenAPI,
   a story. The primary source of truth.
2. **Passive, read-only scan** of the target — structure discovery only:
   - **UI**: load the landing page **once** (Playwright MCP for SPAs), read
     nav/menus/visible entry points and `sitemap.xml`. No clicking flows, no login, no
     form submit, no state changes.
   - **API**: read the Swagger/OpenAPI spec; do **not** call the live API.
   - If blocked (bot wall/captcha), fall back to archetypes and mark features **assumed**.
3. **Coverage checklists / archetypes** — fill gaps and cross-check.

Behavioral recon and execution are **not** here — that is `qa-manual`.

## Do

- Analyze the requirements; identify modules / workflows / endpoints, roles, integrations.
- Identify business, technical, security, accessibility, data, and regression risks
  (use the checklists as the prompt).
- Create the testing strategy: test types, environments, data needs, and what is
  explicitly out of scope.
- Identify the scenarios to test; assign each a stable **`TC-<AREA><NN>`** ID (e.g.
  `TC-L01` for login) — the traceability key threaded through every later deliverable.
- Build the **coverage matrix**: requirement/feature ↔ the `TC-*` scenarios covering it,
  so gaps are visible at a glance.
- Prioritize test areas by risk; document assumptions + open questions; mark
  scan/archetype-derived features **assumed** for manual to confirm.

## Output

`deliverables/<feature>/01-Test-Plan.md`, from the template: executive summary, scope,
out-of-scope, assumptions, open questions, application/API overview, risk assessment,
test strategy, coverage matrix, the scenario inventory (each row carrying its `TC-*` ID
and priority), and regression recommendations — plus the Review Checklist and Review
History sections the `qa-review` protocol maintains. No detailed steps, no payloads, no
automation scope, no code.
