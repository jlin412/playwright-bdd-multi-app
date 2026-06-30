import { test } from '../fixtures';

test.describe('Bestbuy home', () => {
  test('home page loads', async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectLoaded();
  });
});
