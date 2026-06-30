import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Example service object. Rename the class/fixture and replace the endpoints &
// steps with real ones for your API.
@Fixture<typeof test>('exampleApi')
export class ExampleApi {
  private lastStatus = 0;

  constructor(readonly request: APIRequestContext) {}

  async waitUntilReady() {
    await expect
      .poll(
        async () => {
          try {
            return (await this.request.get('/')).status();
          } catch {
            return 0;
          }
        },
        { timeout: 15_000, intervals: [500, 1000, 2000], message: 'Waiting for API root' },
      )
      .toBeLessThan(500);
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @Given('the API is reachable')
  async apiReady() {
    await this.waitUntilReady();
  }

  @When('I request the root path')
  async requestRoot() {
    this.lastStatus = (await this.request.get('/')).status();
  }

  @Then('the response status should be successful')
  async checkOk() {
    expect(this.lastStatus).toBeLessThan(400);
  }
}
