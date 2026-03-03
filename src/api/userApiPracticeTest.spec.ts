// tests/api/userApiPractice.spec.ts
import { test, expect } from '../fixtures/test-fixtures';
import path from 'node:path';
import fs from 'node:fs';
import { STATUS_CODES } from '../api/common/constants';

test.describe('JsonPlaceholder Users API (with fixtures)', () => {
  test('GET /users returns a list of users', async ({ usersApiPractice }) => {
    const { response, json } = await usersApiPractice.getUsers(
      { page: 1, limit: 5 },                     // query params (normalized to strings)
      { 'x-test-header': 'get-users' }           // custom headers
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(STATUS_CODES.ok);

    // json may be null if content-type isn't JSON, guard it
    expect(Array.isArray(json)).toBe(true);
    if (Array.isArray(json)) {
      expect(json.length).toBeGreaterThan(0);
      // Basic shape checks
      for (const u of json) {
        expect(u).toHaveProperty('id');
        expect(u).toHaveProperty('name');
        expect(u).toHaveProperty('username');
        expect(u).toHaveProperty('email');
      }
    }
  });

  test('POST /users (JSON) creates a user (mocked by JSONPlaceholder)', async ({ usersApiPractice }) => {
    const newUser = {
      name: 'Ada Lovelace',
      username: 'adal',
      email: 'ada@example.com',
    };

    const { response, json } = await usersApiPractice.createUser(newUser, {
      'x-test-header': 'create-user-json',
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(STATUS_CODES.created);

    // JSONPlaceholder returns a representation including an id
    expect(json).toBeTruthy();
    if (json) {
      expect(json).toMatchObject(newUser);
      // JSONPlaceholder conventionally returns id: 101 for new resources
      expect((json as any).id).toBeDefined();
    }
  });

  test('POST /users (form-urlencoded) creates a user (mocked)', async ({ usersApiPractice }) => {
    const formBody = {
      name: 'Grace Hopper',
      email: 'grace@example.com',
    };

    const { response, json } = await usersApiPractice.createUserWithForm(formBody, {
      'x-test-header': 'create-user-form',
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(STATUS_CODES.created);
    expect(json).toBeTruthy();
    if (json) {
      expect(json).toMatchObject(formBody);
    }
  });

  test('PUT /users/:id updates a user (mocked)', async ({ usersApiPractice }) => {
    const id = 1;
    const update = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const { response, json } = await usersApiPractice.updateUser(id, update, {
      'x-test-header': 'update-user-put',
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(STATUS_CODES.ok);
    expect(json).toBeTruthy();
    if (json) {
      // JSONPlaceholder echoes back the payload
      expect(json).toMatchObject({ ...update, id });
    }
  });

  test('PATCH /users/:id patches a user (mocked)', async ({ usersApiPractice }) => {
    const id = 2;
    const partial = {
      email: 'patched@example.com',
    };

    const { response, json } = await usersApiPractice.patchUser(id, partial, {
      'x-test-header': 'patch-user',
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(STATUS_CODES.ok);
    expect(json).toBeTruthy();
    if (json) {
      expect(json).toMatchObject({ ...partial, id });
    }
  });

  test('DELETE /users/:id deletes a user (mocked)', async ({ usersApiPractice }) => {
    const id = 3;

    const { response } = await usersApiPractice.deleteUser(id, {
      'x-test-header': 'delete-user',
    });

    // JSONPlaceholder returns 200 for delete
    expect(response.status()).toBe(STATUS_CODES.ok);
    expect(response.ok()).toBeTruthy();
  });

  test.skip('POST /users/:id/avatar with multipart file upload (example)', async ({ usersApiPractice }) => {
    // ⚠️ JSONPlaceholder does not support multipart or custom routes.
    // This test is marked skip to show how you'd call it on a real API.
    const id = 1;
    const samplePng = path.join(__dirname, 'assets', 'avatar.png');
    if (!fs.existsSync(samplePng)) {
      test.skip(true, 'Sample PNG missing; add tests/api/assets/avatar.png to run this.');
    }

    const { response } = await usersApiPractice.uploadAvatar(id, samplePng, {
      'x-test-header': 'upload-avatar',
    });

    expect(response.ok()).toBeTruthy();
    // Expect a 201 or 200 depending on your backend
    expect([200, 201]).toContain(response.status());
  });
});


