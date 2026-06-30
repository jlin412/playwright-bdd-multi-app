import { expect, test } from '../fixtures';

test.describe('Example API', () => {
  test('root path is reachable', async ({ exampleApi }) => {
    await exampleApi.waitUntilReady();
    const res = await exampleApi.request.get('/');
    expect(res.status()).toBeLessThan(500);
  });
});
