# Manual Test Cases — Petstore API

- App: `petstore`
- Source: docs/qa/petstore/TestPlan.md
- Date: 2026-06-30

## Review Status

- Reviewed by:
- Review date:
- Status: `unreviewed`

---

## Overview Table

| Test ID | Plan ID | Area | Scenario | Type | Priority | Automation Candidate |
|---|---|---|---|---|---|---|
| TC-P01 | TC-P01 | Pet | Create pet and retrieve by ID (round-trip) | smoke | High | Yes |
| TC-P02 | TC-P02 | Pet | Find pets by status "available" | smoke | High | Yes |
| TC-P03 | TC-P03 | Pet | Find pets by status "pending" | regression | Medium | Yes |
| TC-P04 | TC-P04 | Pet | Find pets by status "sold" | regression | Medium | Yes |
| TC-P05 | TC-P05 | Pet | Update pet via PUT (full replace) | regression | Medium | Yes |
| TC-P06 | TC-P06 | Pet | Update pet via form POST (name + status) | regression | Medium | Yes |
| TC-P07 | TC-P07 | Pet | Delete pet — subsequent GET returns 404 | regression | Medium | Yes |
| TC-P08 | TC-P08 | Pet | GET pet by non-existent ID → 404 | regression | Low | Yes |
| TC-P09 | TC-P09 | Pet | Find pets by tag (deprecated) — shape or known response | regression | Low | Yes |
| TC-P10 | TC-P10 | Pet | Upload image for a pet — ApiResponse 200 | regression | Low | Partial |
| TC-S01 | TC-S01 | Store | Inventory returns numeric status counts | smoke | High | Yes |
| TC-S02 | TC-S02 | Store | Place order → retrieve by ID (round-trip) | smoke | High | Yes |
| TC-S03 | TC-S03 | Store | Delete order → GET returns 404 | regression | Medium | Yes |
| TC-S04 | TC-S04 | Store | GET order with ID = 0 → 400 | regression | Low | Yes |
| TC-S05 | TC-S05 | Store | GET order by non-existent ID → 404 | regression | Low | Yes |
| TC-U01 | TC-U01 | User | Create user → retrieve by username (round-trip) | smoke | High | Yes |
| TC-U02 | TC-U02 | User | Login with valid credentials — token + headers | smoke | High | Yes |
| TC-U03 | TC-U03 | User | Logout → 200 | regression | Medium | Yes |
| TC-U04 | TC-U04 | User | Update user → re-fetch reflects changes | regression | Medium | Yes |
| TC-U05 | TC-U05 | User | Delete user → GET returns 404 | regression | Medium | Yes |
| TC-U06 | TC-U06 | User | GET non-existent username → 404 | regression | Low | Yes |
| TC-U07 | TC-U07 | User | Create users with array → all usernames retrievable | regression | Low | Yes |
| TC-U08 | TC-U08 | User | Create users with list → all usernames retrievable | regression | Low | Yes |
| TC-A01 | TC-A01 | Auth | GET /store/inventory without api_key — observe behavior | regression | Low | Yes |

---

## Detailed Test Cases

---

### TC-P01 — Create pet and retrieve by ID (round-trip)

- **Plan ID:** TC-P01
- **Area:** Pet
- **Type:** smoke
- **Priority:** High
- **Risk:** R01, R07
- **Automation Candidate:** Yes

**Preconditions:**
- `GET /v2/store/inventory` returns 200 (API is reachable)

**Test Data:**
```json
{
  "id": <timestamp>,
  "name": "TestPet-<timestamp>",
  "photoUrls": [],
  "status": "available"
}
```

**Steps:**
1. Send `POST /v2/pet` with the test pet body (`Content-Type: application/json`).
2. Verify response status is `200`.
3. Verify response body contains `id` matching the sent value and `name` matching `"TestPet-<timestamp>"`.
4. Send `GET /v2/pet/{id}` using the returned `id`.
5. Poll until status is `200` (up to 15 s, 500 ms intervals) — sandbox has eventual consistency.
6. Verify `name` = `"TestPet-<timestamp>"` and `status` = `"available"`.
7. Send `DELETE /v2/pet/{id}` for cleanup.

**Expected Result:**
- POST → 200, body `{ id, name, photoUrls, status }` with correct values.
- GET → 200, body fields `name` and `status` match the created values.
- DELETE → 200 or 404 (best-effort; sandbox may vary).

**Notes:** Existing coverage in `pet.spec.ts` and `pet.feature`. Existing test passes; expand assertions to cover `status` field explicitly.

---

### TC-P02 — Find pets by status "available"

- **Plan ID:** TC-P02
- **Area:** Pet
- **Type:** smoke
- **Priority:** High
- **Risk:** R01
- **Automation Candidate:** Yes

**Preconditions:**
- API is reachable.

**Test Data:** None (query parameter only).

**Steps:**
1. Send `GET /v2/pet/findByStatus?status=available`.
2. Verify response status is `200`.
3. Verify response body is a JSON array.
4. For the first up to 5 items in the array, verify each has `id` (number) and `status` = `"available"`.

**Expected Result:**
- 200, array (may be empty or large — shape only, no exact count).
- Every sampled item has `id` and `status: "available"`.

**Notes:** Existing coverage in `pet.spec.ts` and `pet.feature`.

---

### TC-P03 — Find pets by status "pending"

- **Plan ID:** TC-P03
- **Area:** Pet
- **Type:** regression
- **Priority:** Medium
- **Risk:** R01
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** Query param `status=pending`.

**Steps:**
1. Send `GET /v2/pet/findByStatus?status=pending`.
2. Verify response status is `200`.
3. Verify body is a JSON array.
4. For each item in the first 5 (if any), verify `id` is present and `status` = `"pending"`.

**Expected Result:** 200, array; sampled items have `status: "pending"`.

---

### TC-P04 — Find pets by status "sold"

- **Plan ID:** TC-P04
- **Area:** Pet
- **Type:** regression
- **Priority:** Medium
- **Risk:** R01
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** Query param `status=sold`.

**Steps:**
1. Send `GET /v2/pet/findByStatus?status=sold`.
2. Verify response status is `200`.
3. Verify body is a JSON array.
4. For each item in the first 5 (if any), verify `id` is present and `status` = `"sold"`.

**Expected Result:** 200, array; sampled items have `status: "sold"`.

---

### TC-P05 — Update pet via PUT (full replace)

- **Plan ID:** TC-P05
- **Area:** Pet
- **Type:** regression
- **Priority:** Medium
- **Risk:** R01, R07
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:**
- Create body: `{ id: <ts>, name: "UpdateMe-<ts>", photoUrls: [], status: "available" }`
- Update body: `{ id: <ts>, name: "Updated-<ts>", photoUrls: [], status: "pending" }`

**Steps:**
1. `POST /v2/pet` with the create body → verify 200.
2. `PUT /v2/pet` with the update body (same `id`, new `name` and `status`).
3. Verify PUT response is `200`.
4. `GET /v2/pet/{id}` (poll up to 15 s for eventual consistency).
5. Verify `name` = `"Updated-<ts>"` and `status` = `"pending"`.
6. `DELETE /v2/pet/{id}` for cleanup.

**Expected Result:** After PUT, GET returns updated `name` and `status`.

---

### TC-P06 — Update pet via form POST

- **Plan ID:** TC-P06
- **Area:** Pet
- **Type:** regression
- **Priority:** Medium
- **Risk:** R01, R07
- **Automation Candidate:** Yes

**Preconditions:** API is reachable; a pet has been created.

**Test Data:**
- Create body: `{ id: <ts>, name: "FormPet-<ts>", photoUrls: [], status: "available" }`
- Form fields: `name=FormPetUpdated-<ts>`, `status=sold`

**Steps:**
1. `POST /v2/pet` to create a pet → capture `id`.
2. `POST /v2/pet/{id}` with `Content-Type: application/x-www-form-urlencoded`, body `name=FormPetUpdated-<ts>&status=sold`.
3. Verify response status is `200`.
4. `GET /v2/pet/{id}` (poll up to 15 s).
5. Verify `name` = `"FormPetUpdated-<ts>"` and `status` = `"sold"`.
6. `DELETE /v2/pet/{id}` for cleanup.

**Expected Result:** After form POST, GET reflects new name and status.

---

### TC-P07 — Delete pet — subsequent GET returns 404

- **Plan ID:** TC-P07
- **Area:** Pet
- **Type:** regression
- **Priority:** Medium
- **Risk:** R01, R07
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** `{ id: <ts>, name: "DeleteMe-<ts>", photoUrls: [], status: "available" }`

**Steps:**
1. `POST /v2/pet` to create pet → verify 200.
2. `GET /v2/pet/{id}` (poll) → confirm pet is visible.
3. `DELETE /v2/pet/{id}`.
4. Verify DELETE response is `200`.
5. `GET /v2/pet/{id}` → verify response status is `404`.

**Expected Result:** 404 after deletion.

**Notes:** Sandbox may return `404` immediately or after a short delay.

---

### TC-P08 — GET pet by non-existent ID → 404

- **Plan ID:** TC-P08
- **Area:** Pet
- **Type:** regression
- **Priority:** Low
- **Risk:** —
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** Use an ID that cannot exist, e.g. `9999999999999` (far beyond int64 practical range used by sandbox).

**Steps:**
1. `GET /v2/pet/9999999999999`.
2. Verify response status is `404`.
3. Optionally verify response body contains an error message or `{ code: 1, type: "error" }`.

**Expected Result:** 404, error body.

---

### TC-P09 — Find pets by tag (deprecated endpoint)

- **Plan ID:** TC-P09
- **Area:** Pet
- **Type:** regression
- **Priority:** Low
- **Risk:** R05
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** Query param `tags=tag1`.

**Steps:**
1. `GET /v2/pet/findByTags?tags=tag1`.
2. Record the response status.
3. If `200`: verify body is a JSON array; check first 5 items each have an `id` field.
4. If `410` (Gone) or `404`: log as expected deprecation removal — mark test as skipped/informational.

**Expected Result:** Either 200 with array shape, or a deprecation-era 4xx. Test does not fail on 4xx.

---

### TC-P10 — Upload image for a pet

- **Plan ID:** TC-P10
- **Area:** Pet
- **Type:** regression
- **Priority:** Low
- **Risk:** —
- **Automation Candidate:** Partial (file upload; assert shape only)

**Preconditions:** API is reachable; a pet has been created.

**Test Data:**
- Create body: `{ id: <ts>, name: "ImgPet-<ts>", photoUrls: [], status: "available" }`
- Upload: a small JPEG byte blob (can be a 1×1 pixel JPEG, ~631 bytes)

**Steps:**
1. `POST /v2/pet` to create pet → capture `id`.
2. `POST /v2/pet/{id}/uploadImage` with `Content-Type: multipart/form-data`, field `file` containing the image bytes and optional `additionalMetadata = "test upload"`.
3. Verify response status is `200`.
4. Verify response body has `code` (number) and `type` (string) fields (`ApiResponse` shape).
5. `DELETE /v2/pet/{id}` for cleanup.

**Expected Result:** 200, `{ code, type, message }` body.

---

### TC-S01 — Inventory returns numeric status counts

- **Plan ID:** TC-S01
- **Area:** Store
- **Type:** smoke
- **Priority:** High
- **Risk:** R07
- **Automation Candidate:** Yes

**Preconditions:** None (no auth required in sandbox).

**Steps:**
1. `GET /v2/store/inventory`.
2. Verify response status is `200`.
3. Verify response body is a JSON object (not array).
4. Verify the object has at least one key.
5. Verify every value is of type `number`.

**Expected Result:** 200, `{ "available": <n>, "pending": <n>, ... }` — all values numeric.

**Notes:** Existing coverage in `store.spec.ts` and `store.feature`.

---

### TC-S02 — Place order → retrieve by ID (round-trip)

- **Plan ID:** TC-S02
- **Area:** Store
- **Type:** smoke
- **Priority:** High
- **Risk:** R04, R07
- **Automation Candidate:** Yes

**Preconditions:** API is reachable; a pet exists (or use pet ID `1` from pre-seeded data).

**Test Data:**
```json
{
  "id": 0,
  "petId": 1,
  "quantity": 1,
  "shipDate": "<ISO-8601 date>",
  "status": "placed",
  "complete": false
}
```
(Sending `id: 0` lets the server assign an ID; capture it from the response.)

**Steps:**
1. `POST /v2/store/order` with the order body → verify 200.
2. Capture `id` from response body.
3. Verify response body has `petId` = 1, `quantity` = 1, `status` = `"placed"`.
4. `GET /v2/store/order/{id}`.
5. Verify 200 and `id`, `petId`, `status` match.
6. `DELETE /v2/store/order/{id}` for cleanup.

**Expected Result:** POST → 200 with `Order` body; GET by captured ID → 200 with matching fields.

---

### TC-S03 — Delete order → GET returns 404

- **Plan ID:** TC-S03
- **Area:** Store
- **Type:** regression
- **Priority:** Medium
- **Risk:** R04
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** Same order body as TC-S02.

**Steps:**
1. `POST /v2/store/order` → capture `id`, verify 200.
2. `DELETE /v2/store/order/{id}` → verify 200.
3. `GET /v2/store/order/{id}` → verify response status is `404`.

**Expected Result:** 404 after deletion.

---

### TC-S04 — GET order with ID = 0 → 400

- **Plan ID:** TC-S04
- **Area:** Store
- **Type:** regression
- **Priority:** Low
- **Risk:** —
- **Automation Candidate:** Yes

**Preconditions:** None.

**Steps:**
1. `GET /v2/store/order/0`.
2. Verify response status is `400`.

**Expected Result:** 400 — invalid ID (ID must be ≥ 1 per spec).

---

### TC-S05 — GET order by non-existent ID → 404

- **Plan ID:** TC-S05
- **Area:** Store
- **Type:** regression
- **Priority:** Low
- **Risk:** —
- **Automation Candidate:** Yes

**Preconditions:** None.

**Steps:**
1. `GET /v2/store/order/99999` (an ID outside the pre-seeded 1–10 range and not from a placed order).
2. Verify response status is `404`.

**Expected Result:** 404.

---

### TC-U01 — Create user → retrieve by username (round-trip)

- **Plan ID:** TC-U01
- **Area:** User
- **Type:** smoke
- **Priority:** High
- **Risk:** R03, R07
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:**
```json
{
  "id": 0,
  "username": "testuser-<timestamp>",
  "firstName": "Test",
  "lastName": "User",
  "email": "testuser-<timestamp>@example.com",
  "password": "password123",
  "phone": "555-0100",
  "userStatus": 1
}
```

**Steps:**
1. `POST /v2/user` with the user body → verify 200.
2. `GET /v2/user/testuser-<timestamp>`.
3. Verify 200.
4. Verify `username` = `"testuser-<timestamp>"`, `firstName` = `"Test"`, `email` contains the timestamp slug.
5. `DELETE /v2/user/testuser-<timestamp>` for cleanup.

**Expected Result:** GET returns 200 with matching `username`, `firstName`, `email`.

---

### TC-U02 — Login with valid credentials — token + headers

- **Plan ID:** TC-U02
- **Area:** User
- **Type:** smoke
- **Priority:** High
- **Risk:** R06
- **Automation Candidate:** Yes

**Preconditions:** User exists (created in TC-U01 or as a setup step).

**Test Data:**
- `username`: `testuser-<timestamp>`
- `password`: `password123`

**Steps:**
1. Create user with `POST /v2/user` (if not already existing).
2. `GET /v2/user/login?username=testuser-<timestamp>&password=password123`.
3. Verify response status is `200`.
4. Verify response body is a string (the session token / "logged in user session").
5. Verify response header `X-Expires-After` is present.
6. Verify response header `X-Rate-Limit` is present and is a number.
7. `DELETE /v2/user/testuser-<timestamp>` for cleanup.

**Expected Result:** 200; body is a non-empty string; `X-Expires-After` and `X-Rate-Limit` headers present.

---

### TC-U03 — Logout → 200

- **Plan ID:** TC-U03
- **Area:** User
- **Type:** regression
- **Priority:** Medium
- **Risk:** —
- **Automation Candidate:** Yes

**Preconditions:** None (logout is stateless in the sandbox).

**Steps:**
1. `GET /v2/user/logout`.
2. Verify response status is `200`.

**Expected Result:** 200.

---

### TC-U04 — Update user → re-fetch reflects changes

- **Plan ID:** TC-U04
- **Area:** User
- **Type:** regression
- **Priority:** Medium
- **Risk:** R03, R07
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:**
- Create: `{ username: "updateuser-<ts>", firstName: "Before", email: "before-<ts>@example.com", password: "pass", ... }`
- Update: same object, `firstName: "After"`, `email: "after-<ts>@example.com"`

**Steps:**
1. `POST /v2/user` with initial data → verify 200.
2. `PUT /v2/user/updateuser-<ts>` with updated body (same username, changed `firstName` and `email`).
3. Verify PUT response is `200`.
4. `GET /v2/user/updateuser-<ts>`.
5. Verify `firstName` = `"After"` and `email` = `"after-<ts>@example.com"`.
6. `DELETE /v2/user/updateuser-<ts>` for cleanup.

**Expected Result:** After PUT, GET reflects `firstName: "After"` and updated `email`.

---

### TC-U05 — Delete user → GET returns 404

- **Plan ID:** TC-U05
- **Area:** User
- **Type:** regression
- **Priority:** Medium
- **Risk:** R03
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:** `{ username: "deleteuser-<ts>", ... }`

**Steps:**
1. `POST /v2/user` with user body → verify 200.
2. `DELETE /v2/user/deleteuser-<ts>` → verify 200.
3. `GET /v2/user/deleteuser-<ts>` → verify 404.

**Expected Result:** 404 after deletion.

---

### TC-U06 — GET non-existent username → 404

- **Plan ID:** TC-U06
- **Area:** User
- **Type:** regression
- **Priority:** Low
- **Risk:** —
- **Automation Candidate:** Yes

**Preconditions:** None.

**Test Data:** Username `"nonexistentuser-99999999"` (must not have been created).

**Steps:**
1. `GET /v2/user/nonexistentuser-99999999`.
2. Verify response status is `404`.

**Expected Result:** 404.

---

### TC-U07 — Create users with array → all usernames retrievable

- **Plan ID:** TC-U07
- **Area:** User
- **Type:** regression
- **Priority:** Low
- **Risk:** R03
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:**
```json
[
  { "id": 0, "username": "arrayuser1-<ts>", "firstName": "Array", "lastName": "One", "email": "a1-<ts>@example.com", "password": "pass", "phone": "", "userStatus": 0 },
  { "id": 0, "username": "arrayuser2-<ts>", "firstName": "Array", "lastName": "Two", "email": "a2-<ts>@example.com", "password": "pass", "phone": "", "userStatus": 0 }
]
```

**Steps:**
1. `POST /v2/user/createWithArray` with the array body → verify 200.
2. `GET /v2/user/arrayuser1-<ts>` → verify 200 and `username` matches.
3. `GET /v2/user/arrayuser2-<ts>` → verify 200 and `username` matches.
4. `DELETE /v2/user/arrayuser1-<ts>` and `DELETE /v2/user/arrayuser2-<ts>` for cleanup.

**Expected Result:** Both users retrievable by username after bulk creation.

---

### TC-U08 — Create users with list → all usernames retrievable

- **Plan ID:** TC-U08
- **Area:** User
- **Type:** regression
- **Priority:** Low
- **Risk:** R03
- **Automation Candidate:** Yes

**Preconditions:** API is reachable.

**Test Data:**
```json
[
  { "id": 0, "username": "listuser1-<ts>", "firstName": "List", "lastName": "One", "email": "l1-<ts>@example.com", "password": "pass", "phone": "", "userStatus": 0 },
  { "id": 0, "username": "listuser2-<ts>", "firstName": "List", "lastName": "Two", "email": "l2-<ts>@example.com", "password": "pass", "phone": "", "userStatus": 0 }
]
```

**Steps:**
1. `POST /v2/user/createWithList` with the list body → verify 200.
2. `GET /v2/user/listuser1-<ts>` → verify 200.
3. `GET /v2/user/listuser2-<ts>` → verify 200.
4. Cleanup: DELETE both users.

**Expected Result:** Both users retrievable by username.

**Notes:** Functionally identical to TC-U07 but exercises the `/createWithList` endpoint separately.

---

### TC-A01 — GET /store/inventory without api_key — observe behavior

- **Plan ID:** TC-A01
- **Area:** Auth
- **Type:** regression
- **Priority:** Low
- **Risk:** R02
- **Automation Candidate:** Yes

**Preconditions:** None.

**Steps:**
1. `GET /v2/store/inventory` with **no** `api_key` header.
2. Record the response status.
3. If `200`: note that the sandbox does not enforce the api_key requirement — log as informational.
4. If `401` or `403`: verify the error body has a meaningful message.

**Expected Result:** Sandbox behavior observed and documented; test is informational and does not fail on 200.

---

## Assumptions

- `<timestamp>` / `<ts>` = `Date.now()` or equivalent to ensure unique IDs and usernames across concurrent runs.
- All `DELETE` cleanup steps are best-effort; a failure on cleanup should not cause the test to fail (use try/catch or Playwright's soft assertions).
- `expect.poll` with a 15 s timeout (500 ms intervals) is used wherever a freshly-created resource is read back, due to eventual consistency on the shared sandbox.
- Tests assert **shape** (field presence and type), not exact counts or values that may differ across clients.
