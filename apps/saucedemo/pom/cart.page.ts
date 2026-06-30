import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

@Fixture<typeof test>('cartPage')
export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(readonly page: Page) {
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  // ── Assertions ──────────────────────────────────────────────────────────
  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  async checkout() {
    await this.checkoutButton.click();
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @Then('the cart should contain {int} item(s)')
  async checkCount(count: number) {
    await this.expectItemCount(count);
  }

  @When('I proceed to checkout')
  async checkoutStep() {
    await this.checkout();
  }
}
