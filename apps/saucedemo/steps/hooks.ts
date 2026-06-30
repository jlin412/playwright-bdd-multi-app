import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Before, After } = createBdd(test);

Before(async () => {
  console.log('[saucedemo][Before] Starting scenario...');
});

After(async () => {
  console.log('[saucedemo][After] Scenario completed.');
});
