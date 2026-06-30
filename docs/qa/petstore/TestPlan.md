# Test Plan — Petstore API

- App: `petstore`
- Target: https://petstore.swagger.io/ (Swagger v2, base path `/v2`)
- Mode: API
- Version: 1.0.7
- Date: 2026-06-30

## Review Status

`unreviewed`

---

## 1. Scope

All REST endpoints of the Swagger Petstore API v2:

- **Pet** resource — full CRUD lifecycle, status/tag filtering, image upload
- **Store** resource — inventory reporting, order lifecycle (place, retrieve, delete)
- **User** resource — user lifecycle (create, login, logout, retrieve, update, delete), bulk creation

HTTP methods covered: GET, POST, PUT, DELETE.

---

## 2. Out of Scope

- UI/browser testing (API-only target)
- OAuth2 token acquisition flows (sandbox stubs auth; no real token exchange)
- File upload binary validation beyond HTTP 200 (image content not asserted)
- Deprecated `GET /pet/findByTags` — included as low-priority regression only
- Load / performance / stress testing
- Contract testing against a schema registry

---

## 3. Assumptions

- The petstore sandbox at `https://petstore.swagger.io` is a shared public instance; test data created by other clients may appear in list responses.
- Test assertions focus on **response shape** (required fields, correct types) and **create→retrieve round-trips** rather than exact record counts.
- `expect.poll` with generous timeouts is required for freshly created resources (eventual consistency on the shared sandbox).
- OAuth2 (`petstore_auth`) is not truly enforced in this sandbox — auth-failure scenarios note expected behavior but may not be strictly validated.
- The `api_key` header is not required by the sandbox for protected endpoints; auth negative tests verify behavior without guaranteeing rejection.
- Order IDs from `GET /store/order/{orderId}` are valid only in the range 1–10 (pre-seeded data).
- All test data (pets, orders, users) must be cleaned up after each test to avoid polluting the shared sandbox.

---

## 4. Open Questions

1. Does the sandbox enforce `petstore_auth` scopes at all, or are all Pet CRUD calls freely accepted?
2. Are IDs 1–10 the only valid pre-seeded order IDs, or can placed orders be retrieved by arbitrary ID?
3. Does `POST /user` return a populated User body or just a success acknowledgement?
4. Is `POST /pet/{petId}/uploadImage` fully functional in the sandbox, or does it accept but not store files?
5. What rate-limit value does `X-Rate-Limit` return from `GET /user/login`?

---

## 5. Application / API Overview

The Swagger Petstore is a canonical demonstration API hosted at `https://petstore.swagger.io`. It models a simple pet store with three resource domains:

| Domain | Base Path | Auth |
|---|---|---|
| Pet | `/v2/pet` | `petstore_auth` (OAuth2 implicit); GET by ID uses `api_key` |
| Store | `/v2/store` | Inventory: `api_key`; Orders: unauthenticated |
| User | `/v2/user` | Unauthenticated (login returns a session string) |

Data models: `Pet` (id, name, photoUrls, status, category, tags), `Order` (id, petId, quantity, shipDate, status, complete), `User` (id, username, firstName, lastName, email, password, phone, userStatus), `Category`, `Tag`, `ApiResponse`.

---

## 6. Modules, Features, or Endpoints

| ID | Area | Description | Priority | Risk |
|---|---|---|---|---|
| M-P | Pet | Full CRUD + status/tag filter + image upload | High | Medium — shared sandbox; data contention |
| M-S | Store | Inventory read + order place/retrieve/delete | High | Medium — orderId range constraint |
| M-U | User | User CRUD + login/logout + bulk create | Medium | Low — unauthenticated; sandbox may not persist users |
| M-A | Auth | api_key and OAuth2 scope enforcement | Low | Low — sandbox stubs auth |

### Pet Endpoints

| Endpoint | Method | Notes |
|---|---|---|
| `/v2/pet` | POST | Create pet; requires name + photoUrls |
| `/v2/pet` | PUT | Full update (replace); same schema as POST |
| `/v2/pet/{petId}` | GET | Retrieve by ID; `api_key` in header |
| `/v2/pet/{petId}` | POST | Update name/status via form data |
| `/v2/pet/{petId}` | DELETE | Delete pet |
| `/v2/pet/{petId}/uploadImage` | POST | Upload photo; returns `ApiResponse` |
| `/v2/pet/findByStatus` | GET | Filter by status enum (`available`/`pending`/`sold`) |
| `/v2/pet/findByTags` | GET | Deprecated tag filter |

### Store Endpoints

| Endpoint | Method | Notes |
|---|---|---|
| `/v2/store/inventory` | GET | Map of status → count; `api_key` |
| `/v2/store/order` | POST | Place order; returns `Order` |
| `/v2/store/order/{orderId}` | GET | Retrieve order (ID 1–10 pre-seeded) |
| `/v2/store/order/{orderId}` | DELETE | Delete order |

### User Endpoints

| Endpoint | Method | Notes |
|---|---|---|
| `/v2/user` | POST | Create single user |
| `/v2/user/createWithArray` | POST | Bulk create from JSON array |
| `/v2/user/createWithList` | POST | Bulk create from JSON list |
| `/v2/user/login` | GET | Returns session string + `X-Expires-After`/`X-Rate-Limit` headers |
| `/v2/user/logout` | GET | Invalidates session |
| `/v2/user/{username}` | GET | Retrieve user by username |
| `/v2/user/{username}` | PUT | Update user |
| `/v2/user/{username}` | DELETE | Delete user |

---

## 7. Risk Assessment

| Risk ID | Area | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|---|
| R01 | All | Shared public sandbox — other clients create/delete data | High | High | Assert shape not exact counts; use `expect.poll`; generate unique IDs (timestamp-based) |
| R02 | Pet / Store | OAuth2 not truly enforced — auth negative tests may pass vacuously | Medium | High | Note in test; verify 4xx vs 2xx but don't gate pipeline on auth rejection |
| R03 | All | Orphaned test data on test failure pollutes subsequent runs | Medium | Medium | Cleanup in `afterEach`/`afterAll` via best-effort DELETE |
| R04 | Store | orderId range 1–10 for pre-seeded orders; other IDs may not exist | Medium | Medium | Use `POST /store/order` to create test orders rather than rely on pre-seeded IDs |
| R05 | Pet | Deprecated `findByTags` may be removed | Low | Low | Tag as `@regression` only; skip on 410/404 |
| R06 | User | `X-Rate-Limit` may throttle rapid login calls | Low | Low | Single login call per test; no parallel login scenarios |
| R07 | All | Network flakiness on public endpoint | High | Medium | `expect.poll` with 15–30 s timeout; `retries: 1` in CI |

---

## 8. Test Strategy

**Approach**: Black-box API testing using Playwright's `APIRequestContext`. Each test is independent and manages its own test data lifecycle (create → act → assert → delete).

**Smoke gate** (`@smoke`): The minimum set that must pass on every run — create/retrieve a pet, inventory read, place/retrieve/delete an order, and user login. These reflect the most critical, publicly observable behaviors.

**Regression** (`@regression`): Full coverage of all endpoints including update flows, form-data update, error responses (400/404), deprecated tag filter, and bulk user creation.

**Data isolation**: Use `Date.now()`-based IDs and randomized usernames/emails to avoid collision with other concurrent sandbox users. Clean up all created resources in test teardown.

**Polling**: All freshly-created resources must be fetched via `expect.poll` to handle the sandbox's eventual consistency. Default timeout: 15 s for pets, 10 s for orders/users.

**Shape assertions**: Assert required fields (id, name, status for pets; id, petId, status for orders) and correct types rather than exact values. Never assert total counts from list responses.

---

## 9. Manual Test Case Inventory

### Pet

| Planned Test ID | Area | Scenario | Type | Priority | Risk | Notes |
|---|---|---|---|---|---|---|
| TC-P01 | Pet | Create pet and retrieve by ID (round-trip) | smoke | High | R01, R07 | Existing coverage — verify and expand |
| TC-P02 | Pet | Find pets by status "available" — response is a list with correct shape | smoke | High | R01 | Existing coverage |
| TC-P03 | Pet | Find pets by status "pending" — list returned | regression | Medium | R01 | New |
| TC-P04 | Pet | Find pets by status "sold" — list returned | regression | Medium | R01 | New |
| TC-P05 | Pet | Update pet via PUT — name/status change persists on re-fetch | regression | Medium | R01, R07 | New |
| TC-P06 | Pet | Update pet via form POST (name + status) — changes persist | regression | Medium | R01, R07 | New |
| TC-P07 | Pet | Delete pet — subsequent GET returns 404 | regression | Medium | R01, R07 | New |
| TC-P08 | Pet | GET pet by non-existent ID — returns 404 | regression | Low | — | New; use a far-future timestamp ID |
| TC-P09 | Pet | Find pets by tag (deprecated) — returns 200 or known deprecation response | regression | Low | R05 | New; assert shape if 200 |
| TC-P10 | Pet | Upload image for a pet — returns ApiResponse with 200 | regression | Low | — | New; assert code/type fields |

### Store

| Planned Test ID | Area | Scenario | Type | Priority | Risk | Notes |
|---|---|---|---|---|---|---|
| TC-S01 | Store | Inventory returns object with numeric status counts | smoke | High | R07 | Existing coverage |
| TC-S02 | Store | Place order → retrieve by ID — round-trip | smoke | High | R04, R07 | New |
| TC-S03 | Store | Delete order → verify GET returns 404 | regression | Medium | R04 | New |
| TC-S04 | Store | GET order with ID < 1 (e.g. 0) → 400 | regression | Low | — | New; boundary test |
| TC-S05 | Store | GET order by non-existent ID → 404 | regression | Low | — | New |

### User

| Planned Test ID | Area | Scenario | Type | Priority | Risk | Notes |
|---|---|---|---|---|---|---|
| TC-U01 | User | Create user → retrieve by username — round-trip | smoke | High | R03, R07 | New |
| TC-U02 | User | Login with valid credentials → response is a string token, X-Expires-After header present | smoke | High | R06 | New |
| TC-U03 | User | Logout → returns 200 | regression | Medium | — | New |
| TC-U04 | User | Update user → re-fetch reflects changes | regression | Medium | R03, R07 | New |
| TC-U05 | User | Delete user → GET returns 404 | regression | Medium | R03 | New |
| TC-U06 | User | GET non-existent user → 404 | regression | Low | — | New |
| TC-U07 | User | Create users with array → all usernames retrievable | regression | Low | R03 | New |
| TC-U08 | User | Create users with list → all usernames retrievable | regression | Low | R03 | New |

### Auth

| Planned Test ID | Area | Scenario | Type | Priority | Risk | Notes |
|---|---|---|---|---|---|---|
| TC-A01 | Auth | GET /store/inventory without api_key — observe sandbox behavior (may allow or reject) | regression | Low | R02 | New; informational |

---

## 10. Regression Recommendations

- **Always smoke**: TC-P01, TC-P02, TC-S01, TC-S02, TC-U01, TC-U02 — these cover the core create/read lifecycle across all three resources.
- **Full regression before release**: All TC-P*, TC-S*, TC-U* tests; gate on zero failures.
- **Re-run before declaring flaky**: Network conditions on the public sandbox cause transient 5xx and occasional slow consistency. Re-run twice before escalating.
- **Deprecation watch**: TC-P09 (`findByTags`) — if the sandbox removes the endpoint, mark as `@skip` and log an open item.
- **Cleanup discipline**: Any test that creates a resource must delete it — even on assertion failure. Use `afterEach` teardown, not inline cleanup that may be skipped on early assertion failure.

---

## 11. Review Notes

_To be filled in by reviewer._
