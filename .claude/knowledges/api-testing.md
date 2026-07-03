# Moved → `.claude/checklists/`

Refactored in **QA Toolkit v3**. Domain coverage lists are now single-source
**checklists** (de-duplicated: security / performance are no longer copied per domain).

API coverage now lives across:

- [`checklists/core-api.md`](../checklists/core-api.md) — API functional areas
- [`checklists/security.md`](../checklists/security.md)
- [`checklists/performance.md`](../checklists/performance.md)

Per-phase "how to use these" guidance now lives in the Skills (`.claude/skills/`).

> Do not add coverage here — update the checklist instead. This stub exists only for
> backward compatibility and will be removed once all references point at
> `.claude/checklists/`.
