# Automation Plan — Petstore API

- App: `petstore`
- Source: docs/qa/petstore/TestCases.md
- Date: 2026-06-30

## Review Status

- Reviewed by:
- Review date:
- Status: `unreviewed`

---

## Automation Decisions

| Manual Test ID | Decision | Reason | Target File | Existing Assets to Reuse | New Assets Needed | Tags | Priority |
|---|---|---|---|---|---|---|---|
| TC-P01 | extend-spec | Covered but missing explicit `status` assertion | `specs/api/pet.spec.ts` | `PetApi.buildPet`, `createPet`, `getPet`, `deletePet` | None | `@smoke @api` | High |
| TC-P02 | already-covered | `findByStatus('available')` fully covered in spec + BDD | — | — | — | `@smoke @api` | High |
| TC-P03 | extend-spec + extend-feature | New `pending` status scenario; same `findByStatus` helper | `specs/api/pet.spec.ts`, `features/pet.feature` | `PetApi.findByStatus` | New `@When` decorator on `PetApi` for parameterized status filter | `@regression @api` | Medium |
| TC-P04 | extend-spec + extend-feature | New `sold` status scenario; reuses same decorator as P03 | `specs/api/pet.spec.ts`, `features/pet.feature` | `PetApi.findByStatus` | Reuses P03 decorator | `@regression @api` | Medium |
| TC-P05 | extend-spec + extend-feature | PUT update — new method on `PetApi` | `specs/api/pet.spec.ts`, `features/pet.feature` | `PetApi.buildPet`, `createPet`, `getPet`, `deletePet` | `PetApi.updatePet(pet)` + `@When` BDD decorator | `@regression @api` | Medium |
| TC-P06 | extend-spec | Form POST update — new method; no BDD (form-data edge case) | `specs/api/pet.spec.ts` | `PetApi.createPet`, `deletePet` | `PetApi.updatePetWithForm(id, name, status)` | `@regression @api` | Medium |
| TC-P07 | extend-spec + extend-feature | Delete + 404 verify; needs raw-status helper | `specs/api/pet.spec.ts`, `features/pet.feature` | `PetApi.createPet`, `deletePet`, `buildPet` | `PetApi.getPetStatus(id)` (single GET, returns HTTP status) + `@Then` BDD decorator | `@regression @api` | Medium |
| TC-P08 | extend-spec | 404 on nonexistent ID; reuses `getPetStatus` from P07 | `specs/api/pet.spec.ts` | `PetApi.getPetStatus` | — (depends on P07 asset) | `@regression @api` | Low |
| TC-P09 | extend-spec | Deprecated `findByTags` — conditional assertion | `specs/api/pet.spec.ts` | `PetApi.request` (direct call) | `PetApi.findByTags(tags)` (returns `Pet[]` or throws on 4xx) | `@regression @api` | Low |
| TC-P10 | extend-spec | Image upload; spec only (no BDD — binary payload) | `specs/api/pet.spec.ts` | `PetApi.createPet`, `deletePet` | `PetApi.uploadImage(petId, fileBuffer)` returning `ApiResponse` | `@regression @api` | Low |
| TC-S01 | already-covered | Inventory numeric shape fully covered in spec + BDD | — | — | — | `@smoke @api` | High |
| TC-S02 | extend-spec + extend-feature | Order round-trip — new `StoreApi` methods; promote to smoke | `specs/api/store.spec.ts`, `features/store.feature` | `StoreApi.request`, `waitUntilReady` pattern from `PetApi` | `Order` type, `StoreApi.placeOrder`, `getOrder`, `deleteOrder`, BDD decorators | `@smoke @api` | High |
| TC-S03 | extend-spec + extend-feature | Delete + 404; needs raw-status helper on `StoreApi` | `specs/api/store.spec.ts`, `features/store.feature` | `StoreApi.placeOrder`, `deleteOrder` | `StoreApi.getOrderStatus(id)` (single GET, returns HTTP status) + `@Then` decorator | `@regression @api` | Medium |
| TC-S04 | extend-spec | GET order ID=0 → 400; reuses `getOrderStatus` from S03 | `specs/api/store.spec.ts` | `StoreApi.getOrderStatus` | — (depends on S03 asset) | `@regression @api` | Low |
| TC-S05 | extend-spec | GET order nonexistent ID → 404; reuses `getOrderStatus` | `specs/api/store.spec.ts` | `StoreApi.getOrderStatus` | — | `@regression @api` | Low |
| TC-U01 | new-file | No existing user coverage; new SOM + spec + feature | `som/user.api.ts`, `specs/api/user.spec.ts`, `features/user.feature` | `request` fixture | Full `UserApi` class, `User` type, `user.spec.ts`, `user.feature`, fixture registration in both `specs/fixtures.ts` and `steps/fixtures.ts` | `@smoke @api` | High |
| TC-U02 | new-file | Login + header assertions; part of `UserApi` | `som/user.api.ts`, `specs/api/user.spec.ts` | `UserApi.buildUser`, `createUser`, `deleteUser` | `UserApi.login()` returning token + headers; BDD `@Then` decorator | `@smoke @api` | High |
| TC-U03 | extend (user.spec.ts) | Logout → 200; simple method | `specs/api/user.spec.ts` | `UserApi` | `UserApi.logout()` | `@regression @api` | Medium |
| TC-U04 | extend (user.spec.ts + user.feature) | Update user; needs `updateUser` method | `specs/api/user.spec.ts`, `features/user.feature` | `UserApi.buildUser`, `createUser`, `getUser`, `deleteUser` | `UserApi.updateUser(username, user)` + `@When` decorator | `@regression @api` | Medium |
| TC-U05 | extend (user.spec.ts + user.feature) | Delete + 404; needs raw-status helper | `specs/api/user.spec.ts`, `features/user.feature` | `UserApi.createUser`, `deleteUser` | `UserApi.getUserStatus(username)` (single GET, returns HTTP status) + `@Then` decorator | `@regression @api` | Medium |
| TC-U06 | extend (user.spec.ts) | Nonexistent user → 404; reuses `getUserStatus` | `specs/api/user.spec.ts` | `UserApi.getUserStatus` | — | `@regression @api` | Low |
| TC-U07 | extend (user.spec.ts) | Bulk create with array | `specs/api/user.spec.ts` | `UserApi.buildUser`, `getUser`, `deleteUser` | `UserApi.createUsersWithArray(users)` | `@regression @api` | Low |
| TC-U08 | extend (user.spec.ts) | Bulk create with list | `specs/api/user.spec.ts` | `UserApi.buildUser`, `getUser`, `deleteUser` | `UserApi.createUsersWithList(users)` | `@regression @api` | Low |
| TC-A01 | extend-spec | Informational; no `api_key` header — observe behavior | `specs/api/store.spec.ts` | `request` fixture (direct call) | None — inline `request.get('/v2/store/inventory')` with no header | `@regression @api` | Low |

---

## Reuse Analysis

### PetApi (`apps/petstore/som/pet.api.ts`)

**Already usable as-is:**
- `buildPet(name)` — time-stamped ID builder; reused by all pet tests
- `createPet(pet)` — `POST /v2/pet`
- `getPet(id)` — polls until 200; reused for all round-trip assertions
- `deletePet(id)` — best-effort cleanup; reused everywhere
- `findByStatus(status)` — reused by TC-P03, TC-P04

**Existing BDD decorators** — reused directly by extended BDD scenarios:
- `@Given('the Pet Store API is reachable')` → `apiReady()`
- `@When('I create a pet named {string}')` → `createNamed()`
- `@Then('the pet should be retrievable by id')` → `checkRetrievable()`
- `@When('I request pets with status {string}')` → `requestByStatus()`
- `@Then('the response should be a list of pets')` → `checkList()`

### StoreApi (`apps/petstore/som/store.api.ts`)

**Already usable as-is:**
- `getInventory()` — reused by TC-S01; `@When`/`@Then` BDD decorators already cover inventory
- `@Given('the Pet Store API is reachable')` lives on `PetApi` — the `StoreApi` scenarios that need API readiness should call `petApi.waitUntilReady()` via a shared `@Given` already in `PetApi`, or replicate the pattern in `StoreApi`

### Fixtures

Both fixture files (`specs/fixtures.ts`, `steps/fixtures.ts`) follow identical pattern:
```ts
petApi: async ({ request }, use) => { await use(new PetApi(request)); },
storeApi: async ({ request }, use) => { await use(new StoreApi(request)); },
```
Adding `userApi` follows the same pattern in both files.

### Existing BDD `@Given` for API readiness

`@Given('the Pet Store API is reachable')` is defined on `PetApi`. It calls `waitUntilReady()` which hits `/v2/store/inventory`. All BDD scenarios can use this step — it applies across all three resource areas. No new `@Given` needed for readiness.

---

## New Assets Required

### 1. `PetApi` method additions (`apps/petstore/som/pet.api.ts`)

| Method | Signature | HTTP call | BDD decorator needed |
|---|---|---|---|
| `updatePet` | `(pet: Pet): Promise<Pet>` | `PUT /v2/pet` | Yes — `@When('I update the pet to name {string} with status {string}')` |
| `updatePetWithForm` | `(id: number, name: string, status: PetStatus): Promise<void>` | `POST /v2/pet/{id}` (form-urlencoded) | No (spec-only) |
| `getPetStatus` | `(id: number): Promise<number>` | `GET /v2/pet/{id}` (single, no poll) | Yes — `@Then('the pet should not be found')` |
| `findByTags` | `(tags: string[]): Promise<Pet[] \| null>` | `GET /v2/pet/findByTags?tags=...` | No (spec-only; deprecated) |
| `uploadImage` | `(petId: number, fileBuffer: Buffer): Promise<ApiResponse>` | `POST /v2/pet/{petId}/uploadImage` (multipart) | No (spec-only; binary payload) |

> `ApiResponse` type: `{ code: number; type: string; message: string }` — add at top of `pet.api.ts`.

BDD step additions to `PetApi`:
```
@When('I update the pet to name {string} with status {string}')
→ calls updatePet() with stored createdPet id; stores result

@Then('the pet should not be found')
→ calls getPetStatus(createdPet.id); expects 404
```

**New `pet.feature` scenarios (`@regression`):**
```gherkin
@regression @api
Scenario: Update a pet name and status
  Given the Pet Store API is reachable
  When I create a pet named "UpdateMe"
  And I update the pet to name "UpdatedName" with status "pending"
  Then the pet should be retrievable by id

@regression @api
Scenario: Delete a pet
  Given the Pet Store API is reachable
  When I create a pet named "DeleteMe"
  And I delete the pet
  Then the pet should not be found
```

**New `pet.spec.ts` test blocks:**
- `describe('find by status')` — scenarios for `pending` and `sold`
- `describe('update pet')` — PUT full replace (TC-P05) + form POST (TC-P06)
- `describe('delete pet')` — delete + 404 (TC-P07) + nonexistent 404 (TC-P08)
- `describe('findByTags (deprecated)')` — conditional 200/4xx (TC-P09)
- `describe('upload image')` — multipart upload + ApiResponse shape (TC-P10)

---

### 2. `StoreApi` additions (`apps/petstore/som/store.api.ts`)

**New type at top of file:**
```ts
export type Order = {
  id: number;
  petId: number;
  quantity: number;
  shipDate: string;
  status: 'placed' | 'approved' | 'delivered';
  complete: boolean;
};
```

| Method | Signature | HTTP call | BDD decorator needed |
|---|---|---|---|
| `buildOrder` | `(petId?: number): Order` | — (builder) | No |
| `placeOrder` | `(order: Order): Promise<Order>` | `POST /v2/store/order` | Yes — `@When('I place an order for pet {int}')` |
| `getOrder` | `(id: number): Promise<Order>` | `GET /v2/store/order/{id}` | Yes — `@Then('the order should be retrievable by id')` |
| `deleteOrder` | `(id: number): Promise<void>` | `DELETE /v2/store/order/{id}` | Yes — `@When('I delete the order')` |
| `getOrderStatus` | `(id: number): Promise<number>` | `GET /v2/store/order/{id}` (single, no poll) | Yes — `@Then('the order should not be found')` |

Private state fields to add: `createdOrder?: Order`.

**New `store.feature` scenarios:**
```gherkin
@smoke @api
Scenario: Place and retrieve an order
  Given the Pet Store API is reachable
  When I place an order for pet 1
  Then the order should be retrievable by id

@regression @api
Scenario: Delete an order
  Given the Pet Store API is reachable
  When I place an order for pet 1
  And I delete the order
  Then the order should not be found
```

**New `store.spec.ts` test blocks:**
- `describe('order lifecycle')` — place + retrieve (TC-S02), delete + 404 (TC-S03)
- `describe('order error responses')` — ID=0 → 400 (TC-S04), nonexistent ID → 404 (TC-S05)
- `describe('auth — informational')` — inventory without api_key (TC-A01)

---

### 3. New `UserApi` (`apps/petstore/som/user.api.ts`)

**New file.** Full `@Fixture<typeof test>('userApi')` class following the same three-section POM/SOM layout as the reference (`Assertions / Actions / BDD step decorators`).

**Type at top of file:**
```ts
export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userStatus: number;
};

export type LoginResult = {
  token: string;
  expiresAfter: string;
  rateLimit: string;
};
```

**Methods:**

| Method | Signature | HTTP call | BDD decorator |
|---|---|---|---|
| `buildUser` | `(username: string): User` | — (builder; timestamp slug for uniqueness) | No |
| `createUser` | `(user: User): Promise<void>` | `POST /v2/user` | Yes — `@When('I create a user with username {string}')` |
| `getUser` | `(username: string): Promise<User>` | `GET /v2/user/{username}` (with `expect.poll`, 10 s) | Yes — `@Then('the user {string} should be retrievable')` |
| `getUserStatus` | `(username: string): Promise<number>` | `GET /v2/user/{username}` (single, no poll) | Yes — `@Then('the user should not be found')` |
| `updateUser` | `(username: string, user: User): Promise<void>` | `PUT /v2/user/{username}` | Yes — `@When('I update the user firstName to {string}')` |
| `deleteUser` | `(username: string): Promise<void>` | `DELETE /v2/user/{username}` | Yes — `@When('I delete the user {string}')` |
| `login` | `(username: string, password: string): Promise<LoginResult>` | `GET /v2/user/login?username=&password=` | Yes — `@When('I log in as {string} with password {string}')` |
| `logout` | `(): Promise<void>` | `GET /v2/user/logout` | No |
| `createUsersWithArray` | `(users: User[]): Promise<void>` | `POST /v2/user/createWithArray` | No |
| `createUsersWithList` | `(users: User[]): Promise<void>` | `POST /v2/user/createWithList` | No |

Private state fields: `createdUser?: User`, `lastLogin?: LoginResult`.

**BDD decorators planned:**
```
@Given('the Pet Store API is reachable')  ← reused from PetApi (no duplicate)

@When('I create a user with username {string}')
→ buildUser(username) + createUser(); stores in createdUser

@Then('the user {string} should be retrievable')
→ getUser(username); asserts username + firstName

@Then('the login should succeed with a token')
→ asserts lastLogin.token non-empty + expiresAfter header present

@When('I log in as {string} with password {string}')
→ login(); stores in lastLogin

@When('I update the user firstName to {string}')
→ updateUser(createdUser.username, {...createdUser, firstName})

@Then('the user should not be found')
→ getUserStatus(username); expects 404

@When('I delete the user {string}')
→ deleteUser(username)
```

**New `user.feature`:**
```gherkin
@smoke @api
Feature: Pet Store API - users

  Scenario: Create and retrieve a user
    Given the Pet Store API is reachable
    When I create a user with username "smokeuser"
    Then the user "smokeuser" should be retrievable

  Scenario: Login with valid credentials
    Given the Pet Store API is reachable
    When I create a user with username "loginuser"
    And I log in as "loginuser" with password "password123"
    Then the login should succeed with a token

@regression @api
  Scenario: Update a user
    Given the Pet Store API is reachable
    When I create a user with username "updateuser"
    And I update the user firstName to "UpdatedFirst"
    Then the user "updateuser" should be retrievable

  Scenario: Delete a user
    Given the Pet Store API is reachable
    When I create a user with username "deleteuser"
    And I delete the user "deleteuser"
    Then the user should not be found
```

**New `user.spec.ts` (`apps/petstore/specs/api/user.spec.ts`):**
- `describe('user lifecycle')` — create + retrieve (TC-U01), login + headers (TC-U02), logout (TC-U03)
- `describe('user update / delete')` — update (TC-U04), delete + 404 (TC-U05)
- `describe('user error responses')` — nonexistent → 404 (TC-U06)
- `describe('bulk user creation')` — createWithArray (TC-U07), createWithList (TC-U08)

---

### 4. Fixture registration

Both `apps/petstore/specs/fixtures.ts` and `apps/petstore/steps/fixtures.ts` must add:

```ts
import { UserApi } from '../som/user.api';

// in Fixtures type:
userApi: UserApi;

// in test.extend:
userApi: async ({ request }, use) => { await use(new UserApi(request)); },
```

---

### 5. File summary — create vs. extend

| Action | File |
|---|---|
| **Extend** | `apps/petstore/som/pet.api.ts` |
| **Extend** | `apps/petstore/som/store.api.ts` |
| **Create** | `apps/petstore/som/user.api.ts` |
| **Extend** | `apps/petstore/specs/api/pet.spec.ts` |
| **Extend** | `apps/petstore/specs/api/store.spec.ts` |
| **Create** | `apps/petstore/specs/api/user.spec.ts` |
| **Extend** | `apps/petstore/features/pet.feature` |
| **Extend** | `apps/petstore/features/store.feature` |
| **Create** | `apps/petstore/features/user.feature` |
| **Extend** | `apps/petstore/specs/fixtures.ts` |
| **Extend** | `apps/petstore/steps/fixtures.ts` |

---

## Tests Not Recommended for Automation

None — all 24 test cases are recommended for automation. The three lower-confidence ones below have caveats:

- **TC-P09** (deprecated `findByTags`): automate with conditional assertion; skip on 4xx without failing the suite.
- **TC-P10** (image upload): automate shape assertion only; use a minimal in-memory JPEG byte buffer — do not assert that the image was actually stored.
- **TC-A01** (auth informational): automate as an informational/observational test; assertion is soft (`expect(status).toBeOneOf([200, 401, 403])`); does not gate the pipeline.

---

## Risks / Assumptions

| # | Risk | Mitigation in Implementation |
|---|---|---|
| R01 | Shared sandbox — other clients write data that pollutes list responses | Assert shape and sampled items only; never assert exact counts |
| R02 | OAuth2 / api_key not enforced in sandbox | TC-A01 is informational; auth tests note observed behavior without failing |
| R03 | Orphaned test data on assertion failure | Cleanup in `afterEach` / `try…finally` teardown blocks in every spec |
| R04 | Order ID range 1–10 for pre-seeded orders | Always create orders via `POST /store/order`; capture ID from response |
| R05 | Deprecated `findByTags` may 404/410 | `findByTags()` catches 4xx and returns `null`; spec skips shape assertions on null |
| R06 | Rate-limit headers may differ across sandbox versions | Assert header presence (`X-Expires-After`), not specific value |
| R07 | Network flakiness on public endpoint | `expect.poll` with 15 s timeout for pet/user resources; 10 s for orders; `retries: 1` in CI |

**Key assumption:** `<ts>` / timestamp-based usernames and pet IDs ensure test isolation across concurrent sandbox users. `Date.now()` is used as the base.

---

## Review Notes

_To be filled in by reviewer._
