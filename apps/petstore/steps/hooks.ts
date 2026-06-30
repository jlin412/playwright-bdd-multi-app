import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Before, After } = createBdd(test);

Before(async () => {
  console.log('[petstore][Before] Starting scenario...');
});

After(async () => {
  console.log('[petstore][After] Scenario completed.');
});
