import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { PetApi } from '../som/pet.api';
import { StoreApi } from '../som/store.api';

export const test = base.extend<{
  petApi: PetApi;
  storeApi: StoreApi;
}>({
  petApi: async ({ request }, use) => { await use(new PetApi(request)); },
  storeApi: async ({ request }, use) => { await use(new StoreApi(request)); },
});

export { expect };
