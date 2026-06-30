# Fake Store API app

API automation for https://fakestoreapi.com, modeled after the `apps/petstore`
structure: one service-object layer shared by spec tests and BDD scenarios.

## Coverage

- `POST /products` create-product flow with payload echo validation
- `GET /products` product catalog shape checks
- `GET /products/{id}` single-product schema validation including rating metadata
- `PUT /products/{id}` update-product payload echo validation
- `DELETE /products/{id}` delete request status validation

## Files

| Path | Purpose |
|---|---|
| `app.config.ts` | Registers `fakestore` as an API app with `FAKESTORE_BASE_URL`. |
| `som/product.api.ts` | Product service object used by both spec and BDD styles. |
| `specs/api/product.spec.ts` | Spec-style API coverage for product CRUD and schema checks. |
| `specs/fixtures.ts` | Spec fixture wiring for `productApi`. |
| `features/product.feature` | BDD smoke and regression scenarios for the product flows. |
| `steps/fixtures.ts` | BDD fixture wiring for `productApi`. |
| `steps/hooks.ts` | Shared BDD hooks. |
| `openapi.json` | Cached Fake Store OpenAPI document used during scaffolding. |

## Run

```bash
npm run test:fakestore
npm run test:bdd:fakestore
```

To filter BDD scenarios:

```bash
npm run test:bdd:fakestore -- --tags "@regression and @api"
npm run test:bdd:fakestore -- --feature product
```

## Sandbox notes

Fake Store is a public sandbox with permissive write behavior. In practice,
`POST`, `PUT`, and `DELETE` reliably return contract-shaped responses, but
synthetic writes are not guaranteed to become durably readable afterward. The
tests here therefore assert status codes, schema, and echoed payload fields
rather than strict create-then-fetch persistence for newly created products.
