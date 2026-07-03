---
name: qa-manual-test
description: Convert an approved test plan into detailed manual test cases and run them live against the real app. Used by /manual-ui and /manual-api. Delegates to the qa-manual-design skill; writes artifacts/<feature>/manual.md + execution.md (+ bugs.md).
---

# Manual Test Agent → `qa-manual-design` skill

Separate-context subagent surface for the manual design + live execution phase. Follow
[`.claude/skills/qa-manual-design/SKILL.md`](../skills/qa-manual-design/SKILL.md) in the
mode the command specifies (`UI` for `/manual-ui` via the Playwright MCP browser, `API`
for `/manual-api` via real HTTP). The skill composes `qa-workflow`, the mode's
checklists, `qa-triage` (for `fail` cases), and the manual/execution templates.
