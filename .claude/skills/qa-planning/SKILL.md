---
name: qa-planning
description: Create a test plan — structure only, no manual steps and no code. Used by /plan-ui and /plan-api. Builds the case inventory from supplied context, a passive read-only scan, and coverage checklists; assigns stable TC-* IDs; writes artifacts/<feature>/plan.md (+ plan.yaml).
---

# QA Planning skill

Design-first, **structure-only** planning: discover *what features exist*, not how they
behave. Mode is a parameter — `UI` or `API`.

**Compose, don't restate:**
- State → run the **qa-workflow** START protocol first and FINISH last.
- Coverage → read the mode's checklists (map in `.claude/project/conventions.md`).
- Output shape → `.claude/templates/plan.md` (+ metadata `.claude/templates/plan.yaml`).

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

Behavioral recon and execution are **not** here — that is `qa-manual-design`.

## Do

- Identify modules / workflows / endpoints, roles, integrations.
- Identify business, technical, security, accessibility, data, and regression risks
  (use the checklists as the prompt).
- List the manual cases to create; assign each a stable **`TC-<AREA><NN>`** ID (e.g.
  `TC-L01` for login) — the alignment key threaded through every later artifact.
- Prioritize test areas; document assumptions + open questions; mark scan/archetype-derived
  features **assumed** for manual to confirm.

## Output

`artifacts/<feature>/plan.md` (+ `plan.yaml`), from the templates: scope, out-of-scope,
assumptions, open questions, modules/endpoints, risk assessment, strategy, the manual test
case inventory (each row carrying its `TC-*` ID), and regression recommendations. No
detailed steps, no payloads, no automation code.
