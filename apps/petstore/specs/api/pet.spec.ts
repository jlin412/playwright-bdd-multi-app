import { expect, test } from '../fixtures';

test.describe('Pet Store API - pets', () => {
  test('a created pet can be fetched back by id', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pet = petApi.buildPet('Playwright Pup');
    const created = await petApi.createPet(pet);
    expect(created.id).toBe(pet.id);

    const fetched = await petApi.getPet(pet.id);
    expect(fetched.name).toBe('Playwright Pup');
    expect(fetched.status).toBe('available');

    await petApi.deletePet(pet.id);
  });

  test('findByStatus returns a well-formed list of pets', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pets = await petApi.findByStatus('available');
    expect(Array.isArray(pets)).toBe(true);
    for (const pet of pets.slice(0, 5)) {
      expect(pet).toHaveProperty('id');
      expect(pet.status).toBe('available');
    }
  });
});
