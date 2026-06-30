import { test } from '../fixtures';

test.describe('Example UI', () => {
  test('home page loads', async ({ examplePage }) => {
    await examplePage.goto();
    await examplePage.expectLoaded();
  });
});
