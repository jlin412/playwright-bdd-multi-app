import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Given, Then } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Example page object. Rename the class/fixture and replace the locators &
// steps with real ones for your app. Keep the three-section layout:
// Assertions → Actions → BDD step decorators.
@Fixture<typeof test>('examplePage')
export class ExamplePage {
  readonly heading: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading').first();
  }

  // ── Assertions ──────────────────────────────────────────────────────────
  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/');
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @Given('I open the home page')
  async open() {
    await this.goto();
  }

  @Then('the home page should be loaded')
  async checkLoaded() {
    await this.expectLoaded();
  }
}
