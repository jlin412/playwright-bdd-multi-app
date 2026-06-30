import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { ExamplePage } from '../pom/example.page';
import { ExampleApi } from '../som/example.api';

export const test = base.extend<{
  examplePage: ExamplePage;
  exampleApi: ExampleApi;
}>({
  examplePage: async ({ page }, use) => { await use(new ExamplePage(page)); },
  exampleApi: async ({ request }, use) => { await use(new ExampleApi(request)); },
});

export { expect };
