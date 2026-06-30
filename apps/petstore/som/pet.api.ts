import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators';
import type { test } from '../steps/fixtures';

// Swagger Pet Store (https://petstore.swagger.io/v2) is a shared, mutable public
// sandbox. Tests assert response *shape* and the create→fetch round-trip rather
// than exact counts, and poll for readiness/eventual consistency.
export type PetStatus = 'available' | 'pending' | 'sold';

export type ApiResponse = {
  code: number;
  type: string;
  message: string;
};

export type Pet = {
  id: number;
  name: string;
  photoUrls: string[];
  status: PetStatus;
};

@Fixture<typeof test>('petApi')
export class PetApi {
  private createdPet?: Pet;
  private lastList?: Pet[];

  constructor(readonly request: APIRequestContext) {}

  // ── Actions ─────────────────────────────────────────────────────────────

  async waitUntilReady() {
    await expect
      .poll(
        async () => {
          try {
            const r = await this.request.get('/v2/store/inventory');
            return r.status();
          } catch {
            return 0;
          }
        },
        {
          timeout: 30_000,
          intervals: [500, 1000, 2000],
          message: 'Waiting for Pet Store API to become ready at /store/inventory',
        },
      )
      .toBe(200);
  }

  buildPet(name: string): Pet {
    // Use a time-based id to avoid collisions on the shared sandbox.
    return { id: Date.now(), name, photoUrls: [], status: 'available' };
  }

  async createPet(pet: Pet): Promise<Pet> {
    const res = await this.request.post('/v2/pet', { data: pet });
    expect(res.ok(), `POST /pet failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Pet;
  }

  async getPet(id: number): Promise<Pet> {
    let body: Pet | undefined;
    // The sandbox can briefly 404 a freshly created pet — poll until visible.
    await expect
      .poll(
        async () => {
          const res = await this.request.get(`/v2/pet/${id}`);
          if (res.ok()) {
            body = (await res.json()) as Pet;
          }
          return res.status();
        },
        {
          timeout: 15_000,
          intervals: [500, 1000, 2000],
          message: `Waiting for pet ${id} to be retrievable`,
        },
      )
      .toBe(200);
    return body!;
  }

  async deletePet(id: number) {
    // Best-effort cleanup — ignore failures on the shared sandbox.
    await this.request.delete(`/v2/pet/${id}`).catch(() => undefined);
  }

  async findByStatus(status: PetStatus): Promise<Pet[]> {
    const res = await this.request.get('/v2/pet/findByStatus', { params: { status } });
    expect(res.ok(), `GET /pet/findByStatus failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Pet[];
  }

  async updatePet(pet: Pet): Promise<Pet> {
    const res = await this.request.put('/v2/pet', { data: pet });
    expect(res.ok(), `PUT /pet failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as Pet;
  }

  async updatePetWithForm(id: number, name: string, status: PetStatus): Promise<void> {
    const res = await this.request.post(`/v2/pet/${id}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: { name, status },
    });
    expect(res.ok(), `POST /pet/${id} (form) failed with status ${res.status()}`).toBeTruthy();
  }

  async getPetStatus(id: number): Promise<number> {
    const res = await this.request.get(`/v2/pet/${id}`);
    return res.status();
  }

  async findByTags(tags: string[]): Promise<Pet[] | null> {
    const res = await this.request.get('/v2/pet/findByTags', {
      params: { tags: tags.join(',') },
    });
    if (res.status() >= 400) {
      return null;
    }
    return (await res.json()) as Pet[];
  }

  async uploadImage(petId: number, fileBuffer: Buffer): Promise<ApiResponse> {
    const res = await this.request.post(`/v2/pet/${petId}/uploadImage`, {
      multipart: {
        file: {
          name: 'test.jpg',
          mimeType: 'image/jpeg',
          buffer: fileBuffer,
        },
      },
    });
    expect(res.ok(), `POST /pet/${petId}/uploadImage failed with status ${res.status()}`).toBeTruthy();
    return (await res.json()) as ApiResponse;
  }

  // ── BDD step decorators ─────────────────────────────────────────────────

  @Given('the Pet Store API is reachable')
  async apiReady() {
    await this.waitUntilReady();
  }

  @When('I create a pet named {string}')
  async createNamed(name: string) {
    this.createdPet = await this.createPet(this.buildPet(name));
  }

  @Then('the pet should be retrievable by id')
  async checkRetrievable() {
    expect(this.createdPet, 'a pet must be created before it can be fetched').toBeTruthy();
    const fetched = await this.getPet(this.createdPet!.id);
    expect(fetched.name).toBe(this.createdPet!.name);
    await this.deletePet(this.createdPet!.id);
  }

  @When('I request pets with status {string}')
  async requestByStatus(status: PetStatus) {
    this.lastList = await this.findByStatus(status);
  }

  @Then('the response should be a list of pets')
  async checkList() {
    expect(Array.isArray(this.lastList), 'findByStatus should return an array').toBe(true);
    for (const pet of (this.lastList ?? []).slice(0, 5)) {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('status');
    }
  }

  @When('I update the pet to name {string} with status {string}')
  async updateNamed(name: string, status: string) {
    expect(this.createdPet, 'a pet must be created before it can be updated').toBeTruthy();
    this.createdPet = await this.updatePet({
      ...this.createdPet!,
      name,
      status: status as PetStatus,
    });
  }

  @When('I delete the pet')
  async deleteCurrent() {
    expect(this.createdPet, 'a pet must be created before it can be deleted').toBeTruthy();
    await this.deletePet(this.createdPet!.id);
  }

  @Then('the pet should not be found')
  async checkNotFound() {
    expect(this.createdPet, 'a pet must be created before checking not-found').toBeTruthy();
    const status = await this.getPetStatus(this.createdPet!.id);
    expect(status).toBe(404);
  }
}
