# Skills — reusable QA expertise

Portable QA **methodology**: *how* each specialist works. A skill composes the other
layers rather than restating them — it references Checklists (coverage + review gates),
Templates (deliverable shape), and Project Memory (repo facts). Skills are mode-agnostic
(`UI` / `API` / both is inferred from the target).

| Skill | Specialist | Used by | Deliverable |
|---|---|---|---|
| [qa-test-plan](qa-test-plan/SKILL.md) | Test Plan | `/test-plan` | `01-Test-Plan.md` |
| [qa-manual](qa-manual/SKILL.md) | Manual QA | `/manual-qa` | `02-Manual-QA.md` + UI Gherkin / API specs |
| [qa-automation](qa-automation/SKILL.md) | Automation QA | `/auto-qa` | `03-Automation-QA.md` + code |
| [qa-testops](qa-testops/SKILL.md) | TestOps | `/testops` (feature or `repo`) | `04-TestOps.md` / `_repo/TestOps.md` + `_repo/ledger.md` |
| [qa-investigate](qa-investigate/SKILL.md) | Bug Investigator | `/investigate` (on demand) | `05-Investigations.md` |
| [qa-review](qa-review/SKILL.md) | (shared) | every workflow command | the interactive review (Steps 2–6) |
| [qa-triage](qa-triage/SKILL.md) | (shared) | consumed by manual + automation | `@triage` repro contract + retag-on-fix rule |

## Design rules

- **Focused, not giant.** One discipline per skill; shared concerns (`qa-review`,
  `qa-triage`) are referenced, never copied.
- **Compose the layers.** Coverage → `.claude/checklists/`; deliverable shape →
  `.claude/templates/`; repo facts → `.claude/project/`.
- **Portable.** No repo-specific paths beyond the stable `deliverables/<feature>/`
  layout; anything repo-specific is read from Project Memory.

The five specialist skills each have a paired subagent in `.claude/agents/` for
separate-context delegation of the **generation** step. The `qa-review` protocol
always runs in the main conversation — it is a dialogue with the user.
