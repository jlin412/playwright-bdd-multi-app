---
name: qa-test-plan
description: Test Plan specialist — determines WHAT needs to be tested. Analyzes requirements, identifies risks, and creates the strategy, scenario inventory, and coverage matrix. Used by /test-plan; delegates to the qa-test-plan skill; writes deliverables/<feature>/01-Test-Plan.md. Does NOT decide automation scope, and never runs the interactive review (that stays in the main conversation).
---

# Test Plan Agent → `qa-test-plan` skill

Separate-context subagent surface for the Test Plan specialist. Follow
[`.claude/skills/qa-test-plan/SKILL.md`](../skills/qa-test-plan/SKILL.md) — it composes
the mode's coverage checklists and the `01-test-plan.md` template. Generate the
deliverable only; the calling command handles opening it, the Executive Summary, the
Review Checklist, and the interactive review (`qa-review` skill).
