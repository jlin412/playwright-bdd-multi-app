# Skills — reusable QA expertise

Portable QA **methodology**: *how* to run each phase of the testing lifecycle. A skill
composes the other layers rather than restating them — it references Checklists
(coverage), Templates (artifact shape), and Project Memory (repo facts), and calls
`qa-workflow` for state. Skills are mode-agnostic; the command passes `UI` or `API`.

| Skill | Phase | Used by |
|---|---|---|
| [qa-planning](qa-planning/SKILL.md) | Planning | `/plan-ui`, `/plan-api` |
| [qa-manual-design](qa-manual-design/SKILL.md) | Manual design + live execution | `/manual-ui`, `/manual-api` |
| [qa-automation-plan](qa-automation-plan/SKILL.md) | Automation planning | `/auto-plan-ui`, `/auto-plan-api` |
| [qa-automation](qa-automation/SKILL.md) | Automation implementation | `/auto-ui`, `/auto-api` |
| [qa-triage](qa-triage/SKILL.md) | Failure analysis (seam) | consumed by manual + automation |
| [qa-workflow](qa-workflow/SKILL.md) | State protocol | every phase (START/FINISH) |

## Design rules

- **Focused, not giant.** One discipline per skill; shared concerns are referenced,
  never copied.
- **Compose the layers.** Coverage → `.claude/checklists/`; artifact shape →
  `.claude/templates/`; repo facts → `.claude/project/`; state → `qa-workflow`.
- **Portable.** No repo-specific paths beyond the stable pipeline artifacts; anything
  repo-specific is read from Project Memory.

Each skill has a paired subagent in `.claude/agents/` (same name) for separate-context
delegation via the Task tool; the agent is a thin pointer to the skill.
