import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Before, After } = createBdd(test);

Before(async () => {
  console.log('[__APP_NAME__][Before] Starting scenario...');
});

After(async () => {
  console.log('[__APP_NAME__][After] Scenario completed.');
});
