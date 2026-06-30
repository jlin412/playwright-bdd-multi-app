import { expect, test } from '../fixtures';

test.describe('Pet Store API - store', () => {
  test('inventory returns numeric status counts', async ({ storeApi }) => {
    const inventory = await storeApi.getInventory();

    const values = Object.values(inventory);
    expect(values.length).toBeGreaterThan(0);
    for (const count of values) {
      expect(typeof count).toBe('number');
    }
  });
});

test.describe('Pet Store API - order lifecycle', () => {
  test('place order and retrieve by ID', async ({ petApi, storeApi }) => {
    await petApi.waitUntilReady();

    const order = storeApi.buildOrder(1);
    const placed = await storeApi.placeOrder(order);
    expect(placed.id).toBeGreaterThan(0);
    expect(placed.status).toBe('placed');

    try {
      const fetched = await storeApi.getOrder(placed.id);
      expect(fetched.id).toBe(placed.id);
      expect(fetched.status).toBe('placed');
      expect(fetched).toHaveProperty('petId');
      expect(fetched).toHaveProperty('quantity');
    } finally {
      await storeApi.deleteOrder(placed.id);
    }
  });

  test('delete order - subsequent GET returns 404', async ({ petApi, storeApi }) => {
    await petApi.waitUntilReady();

    const order = storeApi.buildOrder(1);
    const placed = await storeApi.placeOrder(order);

    await storeApi.deleteOrder(placed.id);

    await expect
      .poll(() => storeApi.getOrderStatus(placed.id), {
        timeout: 10_000,
        intervals: [500, 1000, 2000],
        message: 'Waiting for deleted order to return 404',
      })
      .toBe(404);
  });
});

test.describe('Pet Store API - order error responses', () => {
  test('GET order with invalid ID 0 returns client error', async ({ petApi, storeApi }) => {
    await petApi.waitUntilReady();
    // The sandbox returns 404 for order ID 0 (not 400 as the spec implies).
    // Assert a 4xx response to cover both observed behaviors.
    const status = await storeApi.getOrderStatus(0);
    expect(status).toBeGreaterThanOrEqual(400);
    expect(status).toBeLessThan(500);
  });

  test('GET nonexistent order ID returns 404', async ({ petApi, storeApi }) => {
    await petApi.waitUntilReady();
    expect(await storeApi.getOrderStatus(99999)).toBe(404);
  });
});

test.describe('Pet Store API - auth informational', () => {
  test('GET inventory without api_key - observe sandbox behavior', async ({ request, petApi }) => {
    await petApi.waitUntilReady();

    // Informational: the sandbox may or may not enforce authentication.
    // Assert only that the response is one of the expected status codes.
    const res = await request.get('/v2/store/inventory', { headers: {} });
    expect([200, 401, 403]).toContain(res.status());
  });
});
