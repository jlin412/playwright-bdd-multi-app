import { test } from '../fixtures';

test.describe('SauceDemo checkout', () => {
  test('a standard user can complete a purchase end to end', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.expectLoaded();

    await inventoryPage.addItem('sauce-labs-backpack');
    await inventoryPage.expectCartCount(1);
    await inventoryPage.openCart();

    await cartPage.expectItemCount(1);
    await cartPage.checkout();

    await checkoutPage.fillInformation('Test', 'Shopper', '90210');
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });
});
