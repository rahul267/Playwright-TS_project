import { test as base, expect } from '@playwright/test';
import { BaseApiTest } from './baseApi';
import { validateStatus, validateJsonSchema } from '../api/utils/validationUtil';

const postSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    userId: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' }
  },
  required: ['id', 'userId', 'title', 'body']
};

base.describe('Example API Test (Refactored)', () => {
  let apiTest: BaseApiTest;

  base.beforeAll(async () => {
    apiTest = new BaseApiTest();
    await apiTest.init();
  });

  base.afterAll(async () => {
    await apiTest.dispose();
  });

  base('GET /posts/1 returns valid post', async () => {
    const response = await apiTest.apiContext.get('/posts/1');
    validateStatus(response, 200);
    await validateJsonSchema(response, postSchema);
    const data = await response.json();
    expect(data.id).toBe(1);
  });
});