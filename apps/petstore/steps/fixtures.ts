import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { PetApi } from '../som/pet.api';
import { StoreApi } from '../som/store.api';
import { UserApi } from '../som/user.api';

export const test = base.extend<{
  petApi: PetApi;
  storeApi: StoreApi;
  userApi: UserApi;
}>({
  petApi: async ({ request }, use) => { await use(new PetApi(request)); },
  storeApi: async ({ request }, use) => { await use(new StoreApi(request)); },
  userApi: async ({ request }, use) => { await use(new UserApi(request)); },
});

export { expect };
