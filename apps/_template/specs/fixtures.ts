import { test as base, expect } from '@playwright/test';

import { ExamplePage } from '../pom/example.page';
import { ExampleApi } from '../som/example.api';

type Fixtures = {
  examplePage: ExamplePage;
  exampleApi: ExampleApi;
};

export const test = base.extend<Fixtures>({
  examplePage: async ({ page }, use) => { await use(new ExamplePage(page)); },
  exampleApi: async ({ request }, use) => { await use(new ExampleApi(request)); },
});

export { expect };
