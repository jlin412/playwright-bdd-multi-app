# QA Toolkit v3 — Workflow

The testing lifecycle, centered on **human review at every arrow**. AI augments each
stage; a human approves before the next begins. Every stage writes durable artifacts to
`artifacts/<feature>/`, so **chat history is never required to continue** — the files are
the source of truth.

```
Requirements
     │
     ▼
  Planning ───▶ review ───▶ Manual Testing ───▶ review ───▶ Automation ───▶ review
                                                                              │
                                          ┌───────────────────────────────────┘
                                          ▼
                                     Execution ───▶ Failure Analysis ───▶ Continuous Improvement
```

The machine-readable stage graph is [`pipeline.yaml`](pipeline.yaml).

## Stages → skill → artifacts

| Stage | Skill | Command(s) | Artifact(s) |
|---|---|---|---|
| Planning | `qa-planning` | `/plan-ui` · `/plan-api` | `plan.md` + `plan.yaml` |
| Manual Testing | `qa-manual-design` | `/manual-ui` · `/manual-api` | `manual.md` + `manual.yaml` + `execution.md` |
| Automation (design) | `qa-automation-plan` | `/auto-plan-ui` · `/auto-plan-api` | `automation.md` + `automation.yaml` |
| Automation (impl.) | `qa-automation` | `/auto-ui` · `/auto-api` | `automation.*` + code in `apps/<app>/` |
| Execution | (npm scripts) | `npm run test:<feature>` / `test:bdd:<feature>` / `test:triage` | `execution.md` |
| Failure Analysis | `qa-triage` | — (fails surface from manual/execution) | `bugs.md` |
| Continuous Improvement | — | — (retro / coverage-gap review) | `history.md` |

`<feature>` is the QA work unit — an app folder name (`petstore`) or a feature slug. The
automation code still lands in `apps/<app>/` per Project Memory conventions.

## Workflow state (derived, never chat)

State is **computed from the per-stage YAML sidecars** — there is no separate state file
to drift. Given `plan.yaml`, `manual.yaml`, `automation.yaml` (each with a `status` and
approval fields), the toolkit derives:

- **Current Stage** — the earliest stage whose gated status is not `approved`
  (i.e. `draft` / `in-review` / `rejected` / `blocked`), respecting `depends_on`.
- **Completed Stages** — stages with `status: approved`.
- **Pending Review** — stages with `status: in-review`.
- **Blocked Stages** — stages with `status: blocked`.
- **Approval Status** — each stage's `approved_by` + `approval_date`.
- **Next Recommended Command** — the command that produces the Current Stage
  (or, if the current stage is `in-review`, "review & `/approve`").

The `qa-workflow` skill applies these rules on START (validate order) and the `/status`
command surfaces them. `history.md` is the human-readable transition log.

## Stage status lifecycle

```
draft ──▶ in-review ──▶ approved
  ▲            │
  └──rejected──┘         (blocked / stale are set when execution is impossible or an
                          upstream stage was re-run)
```

- `/review` moves a stage `draft → in-review` and reports against the review checklist.
- `/approve` moves `in-review → approved` (sets `approved_by`, `approval_date`).
- `/revise` moves `in-review|rejected → draft` (bumps `version`).
- Re-running an upstream stage marks downstream stages `stale`.
