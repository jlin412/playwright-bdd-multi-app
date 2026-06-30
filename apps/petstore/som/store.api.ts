import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

@Fixture<typeof test>('storeApi')
export class StoreApi {
  private inventory?: Record<string, number>;

  constructor(readonly request: APIRequestContext) {}

  async getInventory(): Promise<Record<string, number>> {
    const res = await this.request.get('/v2/store/inventory');
    expect(res.ok(), `GET /store/inventory failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Record<string, number>;
  }

  // ── BDD step decorators ─────────────────────────────────────────────────
  @When('I request the store inventory')
  async requestInventory() {
    this.inventory = await this.getInventory();
  }

  @Then('the inventory should report numeric status counts')
  async checkInventory() {
    expect(this.inventory, 'inventory must be fetched before asserting').toBeTruthy();
    const values = Object.values(this.inventory!);
    expect(values.length, 'inventory should report at least one status').toBeGreaterThan(0);
    for (const count of values) {
      expect(typeof count).toBe('number');
    }
  }
}
