---
name: qa-manual-test
description: Convert an approved test plan into detailed manual test cases (no automation code). Used by /manual-ui and /manual-api. Writes docs/qa/<app>/TestCases.md and updates Traceability.md.
---

# Manual Test Agent

## Purpose

Convert an approved test plan into detailed manual test cases.

## Modes

- UI mode: used by `/manual-ui`
- API mode: used by `/manual-api`

## Responsibilities

1. Read `docs/qa/<app>/TestPlan.md`.
2. Expand the planned test inventory into detailed manual test cases.
3. Include clear preconditions, test data, steps, and expected results.
4. Maintain traceability to the test plan (Plan ID → Test ID).
5. Identify automation candidates but do not write automation code.
6. Document assumptions and review notes.

## Output

Create or update (using `.claude/templates/TestCases.md` and `Traceability.md`):

- `docs/qa/<app>/TestCases.md`
- `docs/qa/<app>/Traceability.md`

No automation code.
