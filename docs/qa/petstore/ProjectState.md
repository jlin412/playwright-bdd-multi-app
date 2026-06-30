# Project State — petstore

<!--
  Maintained by the QA workflow commands via .claude/agents/workflow-agent.md.
  Update through the commands, not by hand (except Open Items / Blockers).
  Status values: not-started · in-progress · done · approved · stale
-->

- App: `petstore`
- Mode: api
- Target: https://petstore.swagger.io/
- Current stage: automated
- Last updated: 2026-06-30 by /auto-api

## Stages

| # | Stage | Command | Input | Output artifact | Status | Updated |
|---|---|---|---|---|---|---|
| 1 | Planning | /plan-api | https://petstore.swagger.io/ | docs/qa/petstore/TestPlan.md | done | 2026-06-30 |
| 2 | Manual Design | /manual-api | TestPlan.md | docs/qa/petstore/TestCases.md | done | 2026-06-30 |
| 3 | Automation Planning | /auto-plan-api | TestCases.md | docs/qa/petstore/AutomationPlan.md | done | 2026-06-30 |
| 4 | Automation | /auto-api | AutomationPlan.md | apps/petstore/ + docs/qa/petstore/AutomationReport.md | done | 2026-06-30 |

## History

| Date | Command | Summary |
|---|---|---|
| 2026-06-30 | /plan-api | Initial test plan created from https://petstore.swagger.io/ Swagger spec; 3 resource groups (pet, store, user), 24 planned test cases |
| 2026-06-30 | /manual-api | Detailed manual test cases written; 24 cases (TC-P01–P10, TC-S01–S05, TC-U01–U08, TC-A01); Traceability.md created; 3 existing + 21 new cases |
| 2026-06-30 | /auto-plan-api | Automation plan created; 3 already-covered, 21 new; 3 files to extend (pet.api.ts, store.api.ts, pet/store spec+feature), 1 new SOM (user.api.ts), 1 new spec (user.spec.ts), 1 new feature (user.feature), fixture registration in both fixtures files |
| 2026-06-30 | /auto-api | Automation implemented; 24 spec tests + 11 BDD scenarios (6 smoke + 5 regression); tsc: pass; npm run test:petstore: 24 passed; npm run test:bdd:petstore: 6 passed (smoke); regression BDD: 5 passed |

## Open Items / Blockers
