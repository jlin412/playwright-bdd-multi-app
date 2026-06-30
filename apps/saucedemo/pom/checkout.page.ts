import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Covers the three checkout stages: information (step one), overview (step two),
// and the completion page.
@Fixture<typeof test>('checkoutPage')
export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  // ── Assertions ──────────────────────────────────────────────────────────
  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @When('I enter my checkout information')
  async enterInformation() {
    await this.fillInformation('Test', 'Shopper', '90210');
  }

  @When('I finish the checkout')
  async finishStep() {
    await this.finish();
  }

  @Then('I should see the order confirmation')
  async checkComplete() {
    await this.expectOrderComplete();
  }
}
