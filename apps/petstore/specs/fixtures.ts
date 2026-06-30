import { test as base, expect } from '@playwright/test';

import { PetApi } from '../som/pet.api';
import { StoreApi } from '../som/store.api';
import { UserApi } from '../som/user.api';

type Fixtures = {
  petApi: PetApi;
  storeApi: StoreApi;
  userApi: UserApi;
};

export const test = base.extend<Fixtures>({
  petApi: async ({ request }, use) => { await use(new PetApi(request)); },
  storeApi: async ({ request }, use) => { await use(new StoreApi(request)); },
  userApi: async ({ request }, use) => { await use(new UserApi(request)); },
});

export { expect };
