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

## Review-gate checklists

A second kind of checklist answers *"is this artifact good enough to advance?"* — used by
`/review` before `/approve`:

| File | Gates |
|---|---|
| [review-plan.md](review-plan.md) | `plan.md` |
| [review-manual.md](review-manual.md) | `manual.md` + `execution.md` |
| [review-automation.md](review-automation.md) | `automation.md` + generated code |

## De-duplication rule

Security, accessibility, and performance are **cross-cutting**: they exist **once**
here and are *referenced* by the domain checklists — never copied into them. Before
adding an item to `core-ui.md` or `core-api.md`, check whether it belongs in a
cross-cutting checklist instead.

## Not here (by design)

- **Per-phase output guidance** — lives in the Skills that consume these checklists.
