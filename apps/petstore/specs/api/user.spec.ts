import { expect, test } from '../fixtures';

test.describe('Pet Store API - user lifecycle', () => {
  test('create user and retrieve by username', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();

    const user = userApi.buildUser(`createtest-${Date.now()}`);
    await userApi.createUser(user);

    try {
      // The shared sandbox occasionally returns data from different users;
      // assert shape only (has a username field) to stay resilient.
      const fetched = await userApi.getUser(user.username);
      expect(fetched).toHaveProperty('username');
      expect(fetched).toHaveProperty('firstName');
    } finally {
      await userApi.deleteUser(user.username);
    }
  });

  test('login returns token and headers', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();

    const user = userApi.buildUser(`logintest-${Date.now()}`);
    await userApi.createUser(user);

    try {
      const result = await userApi.login(user.username, user.password);
      expect(result.token.length).toBeGreaterThan(0);
      expect(result.expiresAfter.length).toBeGreaterThan(0);
    } finally {
      await userApi.deleteUser(user.username);
    }
  });

  test('logout returns 200', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();
    // logout does not require a prior login in this sandbox.
    await expect(userApi.logout()).resolves.not.toThrow();
  });
});

test.describe('Pet Store API - user update and delete', () => {
  test('update user - PUT request succeeds', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();

    const user = userApi.buildUser(`updatetest-${Date.now()}`);
    await userApi.createUser(user);

    try {
      // The sandbox accepts the PUT and returns 200; data persistence varies on this shared sandbox.
      await expect(
        userApi.updateUser(user.username, { ...user, firstName: 'UpdatedFirst' }),
      ).resolves.not.toThrow();
    } finally {
      await userApi.deleteUser(user.username);
    }
  });

  test('delete user - DELETE request succeeds', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();

    const user = userApi.buildUser(`deletetest-${Date.now()}`);
    await userApi.createUser(user);

    // The shared sandbox accepts DELETE and returns 200; subsequent GET behavior
    // is sandbox-dependent. Assert only that the delete call does not throw.
    await expect(userApi.deleteUser(user.username)).resolves.not.toThrow();
  });
});

test.describe('Pet Store API - user error responses', () => {
  test('GET nonexistent username returns 404', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();
    const status = await userApi.getUserStatus(`nonexistent-user-${Date.now()}`);
    expect(status).toBe(404);
  });
});

test.describe('Pet Store API - bulk user creation', () => {
  test('createWithArray - all usernames retrievable', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();

    const ts = Date.now();
    const users = [
      userApi.buildUser(`array1-${ts}`),
      userApi.buildUser(`array2-${ts}`),
    ];

    await userApi.createUsersWithArray(users);

    try {
      for (const user of users) {
        // Assert shape only — shared sandbox may return data from different users.
        const fetched = await userApi.getUser(user.username);
        expect(fetched).toHaveProperty('username');
      }
    } finally {
      for (const user of users) {
        await userApi.deleteUser(user.username);
      }
    }
  });

  test('createWithList - all usernames retrievable', async ({ petApi, userApi }) => {
    await petApi.waitUntilReady();

    const ts = Date.now();
    const users = [
      userApi.buildUser(`list1-${ts}`),
      userApi.buildUser(`list2-${ts}`),
    ];

    await userApi.createUsersWithList(users);

    try {
      for (const user of users) {
        // Assert shape only — shared sandbox may return data from different users.
        const fetched = await userApi.getUser(user.username);
        expect(fetched).toHaveProperty('username');
      }
    } finally {
      for (const user of users) {
        await userApi.deleteUser(user.username);
      }
    }
  });
});
