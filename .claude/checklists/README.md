# Checklists — reusable coverage gates

Single-source, de-duplicated QA coverage lists. A checklist answers one question:
**"did I cover everything?"** It is a *gate*, not a *method* — the "how to run this
phase" guidance lives in Skills (`.claude/skills/`), and the artifact shapes live in
Templates (`.claude/templates/`).

These files are **portable** (cross-project QA expertise). Repository-specific facts
live in Project Memory (`.claude/project/`), never here.

## Coverage checklists

| File | Concern | Referenced by |
|---|---|---|
| [core-ui.md](core-ui.md) | UI functional coverage | UI planning / manual / automation |
| [core-api.md](core-api.md) | API functional coverage | API planning / manual / automation |
| [security.md](security.md) | Security (all domains) | UI, API, mobile, IoT |
| [accessibility.md](accessibility.md) | Accessibility (UI, mobile) | UI, mobile |
| [performance.md](performance.md) | Performance (all domains) | UI, API, mobile, IoT |
| [mobile.md](mobile.md) | Mobile app coverage | mobile |
| [iot.md](iot.md) | IoT ecosystem coverage | IoT |

## De-duplication rule

Security, accessibility, and performance are **cross-cutting**: they exist **once**
here and are *referenced* by the domain checklists — never copied into them. Before
adding an item to `core-ui.md` or `core-api.md`, check whether it belongs in a
cross-cutting checklist instead.

## Not here (by design)

- **Review-gate checklists** (`review-plan.md`, `review-manual.md`,
  `review-automation.md`) — added with the `/review` command. Those answer *"is this
  artifact good enough to approve?"* rather than *"what should I test?"*.
- **Per-phase output guidance** — lives in the Skills that consume these checklists.
