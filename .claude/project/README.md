# Project Memory — repository-specific knowledge

Facts that are true about **this repository** and would not travel to another
project. Keeping them here isolates them from the portable layers:

| Layer | Portable? | Answers |
|---|---|---|
| `.claude/skills/` | ✅ yes | *How* do I run a QA phase? (methodology) |
| `.claude/checklists/` | ✅ yes | *What* must I cover? (coverage gates) |
| `.claude/templates/` | ✅ yes | *What shape* is the artifact? |
| **`.claude/project/`** | ❌ **no** | *What is true about this repo?* (stack, conventions) |

## Files

- [conventions.md](conventions.md) — how automation code is written in this repo
  (dual-style POM/SOM, three-section layout, locators, tags, where `/auto-*` writes).
- [stack.md](stack.md) — framework facts: app registry, generated projects, env
  model, apps under test, run matrix.

## Why this exists

The reusable toolkit (skills + checklists + templates) can be lifted into another
repository unchanged; only **this** folder is rewritten per project. `/bootstrap`
regenerates these files when the stack changes.

> The full human-facing architecture narrative currently also lives in the root
> `CLAUDE.md`; it will be trimmed to point here during the Documentation phase.
