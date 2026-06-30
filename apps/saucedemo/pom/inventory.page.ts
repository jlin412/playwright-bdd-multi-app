import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

@Fixture<typeof test>('inventoryPage')
export class InventoryPage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  // ── Assertions ──────────────────────────────────────────────────────────
  async expectLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  async expectCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }
    await expect(this.cartBadge).toHaveText(String(count));
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  // itemId is the product slug, e.g. "sauce-labs-backpack".
  addToCartButton(itemId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${itemId}"]`);
  }

  async addItem(itemId: string) {
    await this.addToCartButton(itemId).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @Then('I should see the products page')
  async checkLoaded() {
    await this.expectLoaded();
  }

  @When('I add the {string} to the cart')
  async addItemStep(itemId: string) {
    await this.addItem(itemId);
  }

  @Then('the cart badge should show {int}')
  async checkBadge(count: number) {
    await this.expectCartCount(count);
  }

  @When('I open the cart')
  async openCartStep() {
    await this.openCart();
  }
}
