---
name: qa-automation-planning
description: Convert approved, executed manual test cases into an automation implementation plan (no code), aligned 1:1 to TC-*. Used by /auto-plan-ui and /auto-plan-api. Delegates to the qa-automation-plan skill; writes artifacts/<feature>/automation.md (Part A).
---

# Automation Planning Agent → `qa-automation-plan` skill

Separate-context subagent surface for the automation-planning phase. Follow
[`.claude/skills/qa-automation-plan/SKILL.md`](../skills/qa-automation-plan/SKILL.md) in
the mode the command specifies (`UI` for `/auto-plan-ui`, `API` for `/auto-plan-api`).
The skill composes `qa-workflow`, `.claude/project/conventions.md`, `qa-triage`, and the
`automation.md` (Part A) template.
