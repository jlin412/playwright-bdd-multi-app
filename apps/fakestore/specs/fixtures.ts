import { test as base, expect } from '@playwright/test';

import { ProductApi } from '../som/product.api';

type Fixtures = {
  productApi: ProductApi;
};

export const test = base.extend<Fixtures>({
  productApi: async ({ request }, use) => { await use(new ProductApi(request)); },
});

export { expect };
