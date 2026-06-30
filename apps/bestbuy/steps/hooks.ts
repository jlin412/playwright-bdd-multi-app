import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Before, After } = createBdd(test);

Before(async () => { console.log('[bestbuy][Before] Starting scenario...'); });
After(async () => { console.log('[bestbuy][After] Scenario completed.'); });
