import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { ProductApi } from '../som/product.api';

export const test = base.extend<{
  productApi: ProductApi;
}>({
  productApi: async ({ request }, use) => { await use(new ProductApi(request)); },
});

export { expect };
