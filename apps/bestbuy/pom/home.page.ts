import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Given, Then } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

@Fixture<typeof test>('homePage')
export class HomePage {
  readonly body: Locator;

  constructor(readonly page: Page) {
    this.body = page.locator('body');
  }

  async goto() { await this.page.goto('/'); }
  async expectLoaded() { await expect(this.body).toBeVisible(); }

  @Given('I open the home page')
  async open() { await this.goto(); }

  @Then('the home page should load')
  async checkLoaded() { await this.expectLoaded(); }
}
