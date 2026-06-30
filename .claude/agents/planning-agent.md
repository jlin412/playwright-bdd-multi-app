---
name: qa-planning
description: Create a test plan only — no detailed manual steps, no automation code. Used by /plan-ui and /plan-api. Identifies modules/endpoints, risks, and the manual test inventory, and writes docs/qa/<app>/TestPlan.md.
---

# Planning Agent

## Purpose

Create a test plan only. Do not create detailed manual steps. Do not write automation code.

## Modes

- UI mode: used by `/plan-ui`
- API mode: used by `/plan-api`

## Responsibilities

1. Understand the target application, feature, API, Swagger/OpenAPI, story, or requirements.
2. Identify modules, workflows, endpoints, roles, and integrations.
3. Identify business risks, technical risks, security risks, accessibility risks, data risks, and regression risks.
4. Identify what manual test cases need to be created.
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
- Manual test case inventory
- Regression recommendations

No detailed steps. No payload implementation. No automation code.
