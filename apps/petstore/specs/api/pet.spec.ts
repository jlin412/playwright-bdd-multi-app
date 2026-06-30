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

test.describe('Pet Store API - find by status (regression)', () => {
  test('findByStatus pending returns a well-formed list', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pets = await petApi.findByStatus('pending');
    expect(Array.isArray(pets)).toBe(true);
    for (const pet of pets.slice(0, 5)) {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('status');
    }
  });

  test('findByStatus sold returns a well-formed list', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pets = await petApi.findByStatus('sold');
    expect(Array.isArray(pets)).toBe(true);
    for (const pet of pets.slice(0, 5)) {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('status');
    }
  });
});

test.describe('Pet Store API - update pet', () => {
  test('updatePet (PUT) persists new name and status', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pet = petApi.buildPet('OriginalName');
    await petApi.createPet(pet);

    try {
      const updated = await petApi.updatePet({ ...pet, name: 'Updated', status: 'pending' });
      expect(updated.name).toBe('Updated');
      expect(updated.status).toBe('pending');

      // Poll to confirm the update persisted.
      const fetched = await petApi.getPet(pet.id);
      expect(fetched.name).toBe('Updated');
      expect(fetched.status).toBe('pending');
    } finally {
      await petApi.deletePet(pet.id);
    }
  });

  test('updatePetWithForm (POST form) persists new name and status', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pet = petApi.buildPet('FormOriginal');
    await petApi.createPet(pet);

    try {
      await petApi.updatePetWithForm(pet.id, 'FormUpdated', 'sold');

      // Poll until the update is visible.
      const fetched = await petApi.getPet(pet.id);
      expect(fetched.name).toBe('FormUpdated');
      expect(fetched.status).toBe('sold');
    } finally {
      await petApi.deletePet(pet.id);
    }
  });
});

test.describe('Pet Store API - delete pet', () => {
  test('deletePet - subsequent GET returns 404', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pet = petApi.buildPet('ToDelete');
    await petApi.createPet(pet);

    // Confirm the pet is visible before deleting.
    await petApi.getPet(pet.id);
    await petApi.deletePet(pet.id);

    // Allow some propagation time then assert 404.
    await expect
      .poll(() => petApi.getPetStatus(pet.id), {
        timeout: 10_000,
        intervals: [500, 1000, 2000],
        message: 'Waiting for deleted pet to return 404',
      })
      .toBe(404);
  });

  test('GET nonexistent pet ID returns 404', async ({ petApi }) => {
    await petApi.waitUntilReady();
    expect(await petApi.getPetStatus(999999999)).toBe(404);
  });
});

test.describe('Pet Store API - findByTags (deprecated)', () => {
  test('findByTags returns array or null on deprecation', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const result = await petApi.findByTags(['tag1']);
    if (result !== null) {
      expect(Array.isArray(result)).toBe(true);
    }
    // null means the endpoint returned 4xx (deprecated / gone) — acceptable.
  });
});

test.describe('Pet Store API - upload image', () => {
  test('uploadImage returns ApiResponse shape', async ({ petApi }) => {
    await petApi.waitUntilReady();

    const pet = petApi.buildPet('ImagePet');
    await petApi.createPet(pet);

    try {
      // Minimal valid JPEG byte sequence.
      const jpegBuffer = Buffer.from(
        'FFD8FFE000104A46494600010100000100010000FFDB0043000101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101FFC00B08000100010101110003011100FFC4001F0000010501010101010100000000000000000102030405060708090A0BFFDA00080101000003F0FFFFD9',
        'hex',
      );
      const response = await petApi.uploadImage(pet.id, jpegBuffer);

      expect(response).toHaveProperty('code');
      expect(response).toHaveProperty('type');
    } finally {
      await petApi.deletePet(pet.id);
    }
  });
});
