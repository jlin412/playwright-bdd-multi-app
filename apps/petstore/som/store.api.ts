import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

export type Order = {
  id: number;
  petId: number;
  quantity: number;
  shipDate: string;
  status: 'placed' | 'approved' | 'delivered';
  complete: boolean;
};

@Fixture<typeof test>('storeApi')
export class StoreApi {
  private inventory?: Record<string, number>;
  private createdOrder?: Order;

  constructor(readonly request: APIRequestContext) {}

  // ── Actions ─────────────────────────────────────────────────────────────

  async getInventory(): Promise<Record<string, number>> {
    const res = await this.request.get('/v2/store/inventory');
    expect(res.ok(), `GET /store/inventory failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Record<string, number>;
  }

  buildOrder(petId = 1): Order {
    // Use a time-based id (within JS safe integer range) to avoid sandbox overflow IDs.
    return {
      id: Date.now(),
      petId,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };
  }

  async placeOrder(order: Order): Promise<Order> {
    const res = await this.request.post('/v2/store/order', { data: order });
    expect(res.ok(), `POST /store/order failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Order;
  }

  async getOrder(id: number): Promise<Order> {
    let body: Order | undefined;
    await expect
      .poll(
        async () => {
          const res = await this.request.get(`/v2/store/order/${id}`);
          if (res.ok()) {
            body = (await res.json()) as Order;
          }
          return res.status();
        },
        {
          timeout: 10_000,
          intervals: [500, 1000, 2000],
          message: `Waiting for order ${id} to be retrievable`,
        },
      )
      .toBe(200);
    return body!;
  }

  async deleteOrder(id: number): Promise<void> {
    // Best-effort cleanup — ignore failures on the shared sandbox.
    await this.request.delete(`/v2/store/order/${id}`).catch(() => undefined);
  }

  async getOrderStatus(id: number): Promise<number> {
    const res = await this.request.get(`/v2/store/order/${id}`);
    return res.status();
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

  @When('I place an order for pet {int}')
  async placeOrderForPet(petId: number) {
    this.createdOrder = await this.placeOrder(this.buildOrder(petId));
  }

  @Then('the order should be retrievable by id')
  async checkOrderRetrievable() {
    expect(this.createdOrder, 'an order must be placed before it can be fetched').toBeTruthy();
    const fetched = await this.getOrder(this.createdOrder!.id);
    expect(fetched.id).toBe(this.createdOrder!.id);
    expect(fetched.status).toBe('placed');
    await this.deleteOrder(this.createdOrder!.id);
  }

  @When('I delete the order')
  async deleteCurrentOrder() {
    expect(this.createdOrder, 'an order must be placed before it can be deleted').toBeTruthy();
    await this.deleteOrder(this.createdOrder!.id);
  }

  @Then('the order should not be found')
  async checkOrderNotFound() {
    expect(this.createdOrder, 'an order must be placed before checking not-found').toBeTruthy();
    const status = await this.getOrderStatus(this.createdOrder!.id);
    expect(status).toBe(404);
  }
}
