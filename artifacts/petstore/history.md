# History — petstore

## Transitions

| Date | Stage | Command | From → To status | Summary |
|---|---|---|---|---|
| 2026-06-30 | planning | /plan-api | — → approved | Test plan from the Swagger spec; 3 resource groups (pet, store, user), 24 planned cases |
| 2026-06-30 | manual | /manual-api | — → approved | 24 detailed cases (TC-P01–P10, TC-S01–S05, TC-U01–U08, TC-A01); 3 existing + 21 new |
| 2026-06-30 | automation | /auto-plan-api | — → approved | Plan: 3 already-covered, 21 new; extend pet/store SOM+spec+feature, new user SOM/spec/feature |
| 2026-06-30 | automation | /auto-api | planned → approved | Implemented; 24 spec tests + 11 BDD scenarios (6 smoke + 5 regression); tsc pass; all green |

## Improvement Notes

- Migrated from v6 `docs/qa/petstore/` to the v3 `artifacts/petstore/` model
  (`plan`/`manual`/`automation` + YAML sidecars, `execution`/`bugs`/`history` logs).
