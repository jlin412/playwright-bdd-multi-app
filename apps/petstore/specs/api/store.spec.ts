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
