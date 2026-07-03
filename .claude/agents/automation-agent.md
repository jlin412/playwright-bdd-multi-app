---
name: qa-automation
description: Generate/modify Playwright + playwright-bdd automation code from an approved AutomationPlan. Used by /auto-ui and /auto-api. Delegates to the qa-automation skill; implements approved items into apps/<app>/, reuses existing assets, and writes docs/qa/<app>/AutomationReport.md.
---

# Automation Agent → `qa-automation` skill

Separate-context subagent surface for the automation implementation phase. Follow
[`.claude/skills/qa-automation/SKILL.md`](../skills/qa-automation/SKILL.md) in the mode
the command specifies (`UI` for `/auto-ui`, `API` for `/auto-api`). The skill composes
`qa-workflow`, `.claude/project/conventions.md` (dual-style POM/SOM, locators, tags,
where code is written), `qa-triage`, and the `AutomationReport.md` template.
