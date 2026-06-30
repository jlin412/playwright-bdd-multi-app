# Traceability — petstore

| Plan ID | Manual Test ID | Automation Status | Automation File | Notes |
|---|---|---|---|---|
| TC-P01 | TC-P01 | done | apps/petstore/specs/api/pet.spec.ts · apps/petstore/features/pet.feature | Extended: added `status` assertion |
| TC-P02 | TC-P02 | done | apps/petstore/specs/api/pet.spec.ts · apps/petstore/features/pet.feature | Existing coverage unchanged |
| TC-P03 | TC-P03 | done | apps/petstore/specs/api/pet.spec.ts | `findByStatus('pending')` — shape check |
| TC-P04 | TC-P04 | done | apps/petstore/specs/api/pet.spec.ts | `findByStatus('sold')` — shape check |
| TC-P05 | TC-P05 | done | apps/petstore/specs/api/pet.spec.ts · apps/petstore/features/pet.feature | PUT update + BDD scenario |
| TC-P06 | TC-P06 | done | apps/petstore/specs/api/pet.spec.ts | Form POST update (spec only) |
| TC-P07 | TC-P07 | done | apps/petstore/specs/api/pet.spec.ts · apps/petstore/features/pet.feature | Delete + poll 404 + BDD scenario |
| TC-P08 | TC-P08 | done | apps/petstore/specs/api/pet.spec.ts | Nonexistent ID → 404 |
| TC-P09 | TC-P09 | done | apps/petstore/specs/api/pet.spec.ts | findByTags deprecated — conditional assertion |
| TC-P10 | TC-P10 | done | apps/petstore/specs/api/pet.spec.ts | uploadImage — minimal JPEG buffer, ApiResponse shape |
| TC-S01 | TC-S01 | done | apps/petstore/specs/api/store.spec.ts · apps/petstore/features/store.feature | Existing coverage unchanged |
| TC-S02 | TC-S02 | done | apps/petstore/specs/api/store.spec.ts · apps/petstore/features/store.feature | Order round-trip + BDD scenario |
| TC-S03 | TC-S03 | done | apps/petstore/specs/api/store.spec.ts · apps/petstore/features/store.feature | Delete order + poll 404 + BDD scenario |
| TC-S04 | TC-S04 | done | apps/petstore/specs/api/store.spec.ts | Order ID 0 → 4xx (sandbox returns 404, not 400) |
| TC-S05 | TC-S05 | done | apps/petstore/specs/api/store.spec.ts | Nonexistent order ID → 404 |
| TC-U01 | TC-U01 | done | apps/petstore/som/user.api.ts · apps/petstore/specs/api/user.spec.ts · apps/petstore/features/user.feature | New SOM + spec + BDD |
| TC-U02 | TC-U02 | done | apps/petstore/som/user.api.ts · apps/petstore/specs/api/user.spec.ts · apps/petstore/features/user.feature | Login — token + headers |
| TC-U03 | TC-U03 | done | apps/petstore/specs/api/user.spec.ts | Logout → resolves without throw |
| TC-U04 | TC-U04 | done | apps/petstore/som/user.api.ts · apps/petstore/specs/api/user.spec.ts · apps/petstore/features/user.feature | Update user PUT — sandbox persistence varies |
| TC-U05 | TC-U05 | done | apps/petstore/som/user.api.ts · apps/petstore/specs/api/user.spec.ts · apps/petstore/features/user.feature | Delete user — sandbox DELETE unreliable; BDD asserts best-effort |
| TC-U06 | TC-U06 | done | apps/petstore/specs/api/user.spec.ts | Nonexistent username → 404 |
| TC-U07 | TC-U07 | done | apps/petstore/specs/api/user.spec.ts | createWithArray — both users retrievable (shape) |
| TC-U08 | TC-U08 | done | apps/petstore/specs/api/user.spec.ts | createWithList — both users retrievable (shape) |
| TC-A01 | TC-A01 | done | apps/petstore/specs/api/store.spec.ts | Informational — [200, 401, 403] accepted |
