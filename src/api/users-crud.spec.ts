import { test, expect } from '../fixtures/test-fixtures';
// import { JsonPlaceholderUsersApi } from '../api/serviceApis/userApi';
import { USERS } from '../api/common/testData';
import { MESSAGES } from '../api/common/constants';
import { STATUS_CODES } from '../api/common/constants';
// import { BASE_URLS } from '../api/common/endpoints';

test.describe('JSONPlaceholder - Users API CRUD', () => {
  test('GET /users should return list of users', async ({ jsonUsersApi }) => {
    const response = await jsonUsersApi.getUsers();
    expect(response.status()).toBe(STATUS_CODES.ok);

    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);

    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
  });

  test('POST /users should create a new user', async ({ jsonUsersApi }) => {
    const response = await jsonUsersApi.createUser(USERS.newUser);
    expect(response.status()).toBe(STATUS_CODES.created);

    const createdUser = await response.json();
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(USERS.newUser.name);
    expect(createdUser.username).toBe(USERS.newUser.username);
    expect(createdUser.email).toBe(USERS.newUser.email);
  });

  test('PUT /users/1 should update the user completely', async ({ jsonUsersApi }) => {
    const response = await jsonUsersApi.updateUser(1, USERS.updatedUser);
    expect(response.status()).toBe(STATUS_CODES.ok);

    const user = await response.json();
    expect(user.name).toBe(USERS.updatedUser.name);
    expect(user.username).toBe(USERS.updatedUser.username);
    expect(user.email).toBe(USERS.updatedUser.email);
  });

  test('PATCH /users/1 should update part of the user', async ({ jsonUsersApi }) => {
    const response = await jsonUsersApi.patchUser(1, USERS.patchedUser);
    expect(response.status()).toBe(STATUS_CODES.ok);

    const user = await response.json();
    expect(user.username).toBe(USERS.patchedUser.username);
  });

  test('DELETE /users/1 should delete the user', async ({ jsonUsersApi }) => {
    const response = await jsonUsersApi.deleteUser(1);
    expect(response.status()).toBe(STATUS_CODES.ok); // mock response
    console.log(MESSAGES.userDeleted);
  });
});