import { expect, test } from '../fixtures';

test.describe('Fake Store API - products', () => {
  test('createProduct returns 201 and echoes the submitted product fields', async ({ productApi }) => {
    await productApi.waitUntilReady();

    const payload = productApi.buildProduct();
    const created = await productApi.createProduct(payload);

    productApi.expectProductMatchesPayload(created, payload);
  });

  test('getAllProducts returns a well-formed product list', async ({ productApi }) => {
    await productApi.waitUntilReady();

    const products = await productApi.getAllProducts();

    expect(products.length).toBeGreaterThan(0);
    for (const product of products.slice(0, 5)) {
      productApi.expectProductShape(product);
    }
  });

  test('getProduct returns a well-formed product with rating metadata', async ({ productApi }) => {
    await productApi.waitUntilReady();

    const product = await productApi.getProduct(1);

    productApi.expectProductShape(product, { includeRating: true });
  });
});

test.describe('Fake Store API - products (regression)', () => {
  test('updateProduct returns 200 and echoes the updated product fields', async ({ productApi }) => {
    await productApi.waitUntilReady();

    const payload = productApi.buildProduct({ title: 'Playwright Updated Product' });
    const updated = await productApi.updateProduct(21, payload);

    productApi.expectProductMatchesPayload(updated, payload);
  });

  test('deleteProduct returns 200 for a numeric product id', async ({ productApi }) => {
    await productApi.waitUntilReady();

    const status = await productApi.deleteProduct(21);

    expect(status).toBe(200);
  });
});