---
name: qa-planning
description: Create a test plan only — no detailed manual steps, no automation code. Used by /plan-ui and /plan-api. Identifies modules/endpoints, risks, and the manual test inventory, and writes docs/qa/<app>/TestPlan.md.
---

# Planning Agent

## Purpose

Create a test plan only, built from three sources **in priority order**:

1. **Supplied context** (when provided) — screenshots, files, or text: existing
   requirements, a test plan/test cases, a feature list, functionality descriptions,
   or a role & rights matrix, in any combination. This is the primary source of truth.
2. **A passive, read-only scan of the target** — to discover *what features exist*
   (structure only; see the command for the per-mode method).
3. **Testing knowledge & experience** — domain archetypes to fill gaps and cross-check.

Discover **structure, not behavior**: do **not** exercise flows, authenticate, trigger
states, or execute cases, and do not create detailed manual steps — that is the manual
phase (`/manual-*`). Mark scan/archetype-derived features **assumed** for manual to
confirm. Do not write automation code.

## Modes

- UI mode: used by `/plan-ui`
- API mode: used by `/plan-api`

## Responsibilities

1. Understand the target from all supplied context (requirements, test plan/cases,
   feature list, functionality descriptions, role & rights matrix, screenshots, files,
   Swagger/OpenAPI, story) plus a passive read-only scan of the target.
2. Identify modules, workflows, endpoints, roles, and integrations.
3. Identify business risks, technical risks, security risks, accessibility risks, data risks, and regression risks.
4. Identify what manual test cases need to be created, and assign each a **stable
   case ID** (`TC-<AREA><NN>`, e.g. `TC-L01` for login) carried unchanged through
   manual design, execution, and automation — the ID is the alignment key across
   every downstream artifact.
5. Prioritize test areas.
6. Document assumptions and open questions.

## Output

Create or update `docs/qa/<app>/TestPlan.md` (`<app>` = the `apps/<name>/` folder
under test, or a slug for a new target). Use `.claude/templates/TestPlan.md`.

The output must include:

- Scope
- Out of scope
- Assumptions
- Open questions
- Modules/features/endpoints
- Risk assessment
- Test strategy
- Manual test case inventory (each row carrying its stable `TC-<AREA><NN>` ID)
- Regression recommendations

No detailed steps. No payload implementation. No behavioral exploration or execution
(passive structure scan is allowed). No automation code.
