import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Fake Store is a public sandbox: create/update/delete return contract-shaped
// responses, but synthetic writes are not guaranteed to be readable afterward.
// These tests assert echoed payloads and stable schema on known product records.
export type ProductInput = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = ProductInput & {
  id: number;
  rating?: ProductRating;
};

@Fixture<typeof test>('productApi')
export class ProductApi {
  private createdPayload?: ProductInput;
  private createdProduct?: Product;
  private updatedPayload?: ProductInput;
  private updatedProduct?: Product;
  private fetchedProduct?: Product;
  private lastList?: Product[];
  private lastDeleteStatus?: number;

  constructor(readonly request: APIRequestContext) {}

  // ── Assertions ─────────────────────────────────────────────────────────────

  expectProductShape(product: Product, options: { includeRating?: boolean } = {}) {
    expect(typeof product.id).toBe('number');
    expect(typeof product.title).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.description).toBe('string');
    expect(typeof product.category).toBe('string');
    expect(typeof product.image).toBe('string');

    if (options.includeRating) {
      expect(product.rating, 'expected product rating metadata').toBeTruthy();
      expect(typeof product.rating!.rate).toBe('number');
      expect(typeof product.rating!.count).toBe('number');
    }
  }

  expectProductMatchesPayload(product: Product, payload: ProductInput) {
    this.expectProductShape(product);
    expect(product.id).toBeGreaterThan(0);
    expect(product.title).toBe(payload.title);
    expect(product.price).toBe(payload.price);
    expect(product.description).toBe(payload.description);
    expect(product.category).toBe(payload.category);
    expect(product.image).toBe(payload.image);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitUntilReady() {
    await expect
      .poll(
        async () => {
          try {
            return (await this.request.get('/products')).status();
          } catch {
            return 0;
          }
        },
        {
          timeout: 30_000,
          intervals: [500, 1000, 2000],
          message: 'Waiting for Fake Store products API to become ready at /products',
        },
      )
      .toBe(200);
  }

  buildProduct(overrides: Partial<ProductInput> = {}): ProductInput {
    const stamp = Date.now();
    return {
      title: `Playwright Product ${stamp}`,
      price: 12.34,
      description: `created by Playwright at ${stamp}`,
      category: 'electronics',
      image: 'https://example.com/product.png',
      ...overrides,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    const res = await this.request.get('/products');
    expect(res.ok(), `GET /products failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Product[];
  }

  async getProduct(id: number): Promise<Product> {
    const res = await this.request.get(`/products/${id}`);
    expect(res.ok(), `GET /products/${id} failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Product;
  }

  async createProduct(product: ProductInput): Promise<Product> {
    const res = await this.request.post('/products', { data: product });
    expect(res.status(), `POST /products failed with status ${res.status()}`).toBe(201);
    return (await res.json()) as Product;
  }

  async updateProduct(id: number, product: ProductInput): Promise<Product> {
    const res = await this.request.put(`/products/${id}`, { data: product });
    expect(res.status(), `PUT /products/${id} failed with status ${res.status()}`).toBe(200);
    return (await res.json()) as Product;
  }

  async deleteProduct(id: number): Promise<number> {
    const res = await this.request.delete(`/products/${id}`);
    expect(res.status(), `DELETE /products/${id} failed with status ${res.status()}`).toBe(200);
    return res.status();
  }

  // ── BDD step decorators ────────────────────────────────────────────────────

  @Given('the Fake Store products API is reachable')
  async apiReady() {
    await this.waitUntilReady();
  }

  @When('I create a product titled {string}')
  async createTitledProduct(title: string) {
    this.createdPayload = this.buildProduct({ title });
    this.createdProduct = await this.createProduct(this.createdPayload);
  }

  @Then('the created product should match the submitted payload')
  async checkCreatedProduct() {
    expect(this.createdPayload, 'a product payload must be built before validation').toBeTruthy();
    expect(this.createdProduct, 'a product must be created before validation').toBeTruthy();
    this.expectProductMatchesPayload(this.createdProduct!, this.createdPayload!);
  }

  @When('I request all products')
  async requestAllProducts() {
    this.lastList = await this.getAllProducts();
  }

  @Then('the response should be a list of products')
  async checkProductList() {
    expect(Array.isArray(this.lastList), 'GET /products should return an array').toBe(true);
    expect((this.lastList ?? []).length).toBeGreaterThan(0);
    for (const product of (this.lastList ?? []).slice(0, 5)) {
      this.expectProductShape(product);
    }
  }

  @When('I request product {int}')
  async requestProduct(id: number) {
    this.fetchedProduct = await this.getProduct(id);
  }

  @Then('the product details should include rating metadata')
  async checkFetchedProduct() {
    expect(this.fetchedProduct, 'a product must be requested before validation').toBeTruthy();
    this.expectProductShape(this.fetchedProduct!, { includeRating: true });
  }

  @When('I update product {int} to title {string}')
  async updateProductTitle(id: number, title: string) {
    this.updatedPayload = this.buildProduct({ title });
    this.updatedProduct = await this.updateProduct(id, this.updatedPayload);
  }

  @Then('the updated product should match the submitted payload')
  async checkUpdatedProduct() {
    expect(this.updatedPayload, 'an update payload must be built before validation').toBeTruthy();
    expect(this.updatedProduct, 'a product must be updated before validation').toBeTruthy();
    this.expectProductMatchesPayload(this.updatedProduct!, this.updatedPayload!);
  }

  @When('I delete product {int}')
  async deleteExistingProduct(id: number) {
    this.lastDeleteStatus = await this.deleteProduct(id);
  }

  @Then('the delete request should complete without a server error')
  async checkDeleteStatus() {
    expect(this.lastDeleteStatus).toBe(200);
  }
}