import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pom/login.page';
import { InventoryPage } from '../pom/inventory.page';
import { CartPage } from '../pom/cart.page';
import { CheckoutPage } from '../pom/checkout.page';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
});

export { expect };
