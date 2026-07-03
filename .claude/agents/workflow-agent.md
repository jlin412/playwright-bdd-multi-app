---
name: qa-workflow
description: Internal state manager for the QA pipeline. Reads, validates, and updates docs/qa/<app>/ProjectState.md, enforcing phase order (plan → manual → auto-plan → auto). Invoked by every pipeline command at start (read + validate) and finish (update). Not a user-facing command.
---

# Workflow Agent → `qa-workflow` skill

Separate-context subagent surface for pipeline state. Follow
[`.claude/skills/qa-workflow/SKILL.md`](../skills/qa-workflow/SKILL.md), which owns the
stage table, the START (read + validate) and FINISH (update) protocols, and the review
gate. It writes only `docs/qa/<app>/ProjectState.md` — never test artifacts or code.
