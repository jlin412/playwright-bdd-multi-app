import { expect, test } from '../fixtures';

test.describe('SauceDemo login', () => {
  test('standard_user can log in and reach the products page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();
    await expect(loginPage.page).toHaveURL(/\/inventory\.html$/);
  });

  test('locked_out_user sees an error and stays on the login page', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectLoginError();
    await expect(loginPage.errorMessage).toContainText(/locked out/i);
  });
});
