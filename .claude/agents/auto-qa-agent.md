---
name: qa-automation
description: Automation QA specialist — converts the approved Gherkin into high-quality Playwright automation. Evaluates EVERY manual case, maximizes automation, explains every non-automated case, generates tests/steps/POM/SOM/fixtures reuse-first, and iterates generate→run→fix locally until stable. Used by /auto-qa; delegates to the qa-automation skill; writes code into apps/<app>/ + deliverables/<feature>/03-Automation-QA.md. Never runs the interactive review (that stays in the main conversation).
---

# Automation QA Agent → `qa-automation` skill

Separate-context subagent surface for the Automation QA specialist. Follow
[`.claude/skills/qa-automation/SKILL.md`](../skills/qa-automation/SKILL.md) — it
composes `.claude/project/conventions.md` (dual-style POM/SOM, locators, tags, where
code is written), `qa-triage` (fail-case repros), and the `03-automation-qa.md`
template. Generate the code + deliverable only; the calling command handles the
interactive review (`qa-review` skill).
