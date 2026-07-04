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
| [core-ui.md](core-ui.md) | UI functional coverage | UI test-plan / manual-qa / auto-qa |
| [core-api.md](core-api.md) | API functional coverage | API test-plan / manual-qa / auto-qa |
| [security.md](security.md) | Security (all domains) | UI, API, mobile, IoT |
| [accessibility.md](accessibility.md) | Accessibility (UI, mobile) | UI, mobile |
| [performance.md](performance.md) | Performance (all domains) | UI, API, mobile, IoT |
| [mobile.md](mobile.md) | Mobile app coverage | mobile |
| [iot.md](iot.md) | IoT ecosystem coverage | IoT |

## Review checklists

A second kind of checklist answers *"is this deliverable good enough to build on?"* —
displayed by each workflow command as Step 4 of the `qa-review` protocol and mirrored
into the deliverable's Review Checklist section:

| File | Reviews | Command |
|---|---|---|
| [review-test-plan.md](review-test-plan.md) | `01-Test-Plan.md` | `/test-plan` |
| [review-manual-qa.md](review-manual-qa.md) | `02-Manual-QA.md` + Gherkin updates | `/manual-qa` |
| [review-auto-qa.md](review-auto-qa.md) | `03-Automation-QA.md` + generated code | `/auto-qa` |
| [review-testops.md](review-testops.md) | `04-TestOps.md` | `/testops` |

## De-duplication rule

Security, accessibility, and performance are **cross-cutting**: they exist **once**
here and are *referenced* by the domain checklists — never copied into them. Before
adding an item to `core-ui.md` or `core-api.md`, check whether it belongs in a
cross-cutting checklist instead.

## Not here (by design)

- **Per-phase output guidance** — lives in the Skills that consume these checklists.
