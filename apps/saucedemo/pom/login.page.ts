import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// SauceDemo (https://www.saucedemo.com) is a public demo store.
// Accepted usernames include: standard_user, locked_out_user, problem_user,
// performance_glitch_user — all share the password below.
const DEFAULT_USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const DEFAULT_PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

@Fixture<typeof test>('loginPage')
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // ── Assertions ──────────────────────────────────────────────────────────
  async expectLoaded() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    await this.login(DEFAULT_USERNAME, DEFAULT_PASSWORD);
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @Given('I am on the login page')
  async open() {
    await this.goto();
    await this.expectLoaded();
  }

  @When('I log in as {string}')
  async loginAs(username: string) {
    await this.login(username, DEFAULT_PASSWORD);
  }

  @When('I log in with username {string} and password {string}')
  async loginWith(username: string, password: string) {
    await this.login(username, password);
  }

  @Given('I am logged in as a standard user')
  async loginStandard() {
    await this.goto();
    await this.loginAsStandardUser();
  }

  @Then('I should see a login error')
  async checkError() {
    await this.expectLoginError();
  }
}
