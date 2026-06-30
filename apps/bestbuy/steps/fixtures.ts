import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { HomePage } from '../pom/home.page';

export const test = base.extend<{
  homePage: HomePage;
}>({
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
});

export { expect };
