import { test } from '../fixtures';

test.describe('SauceDemo cart', () => {
  test('adding an item updates the cart badge', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.expectLoaded();

    await inventoryPage.expectCartCount(0);
    await inventoryPage.addItem('sauce-labs-backpack');
    await inventoryPage.expectCartCount(1);
  });
});
