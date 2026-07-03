---
name: qa-planning
description: Create a test plan only — no detailed manual steps, no automation code. Used by /plan-ui and /plan-api. Delegates to the qa-planning skill; writes docs/qa/<app>/TestPlan.md.
---

# Planning Agent → `qa-planning` skill

Separate-context subagent surface for the planning phase. Follow
[`.claude/skills/qa-planning/SKILL.md`](../skills/qa-planning/SKILL.md) in the mode the
command specifies (`UI` for `/plan-ui`, `API` for `/plan-api`). The skill composes the
`qa-workflow` state protocol, the mode's checklists, and the `TestPlan.md` template.
