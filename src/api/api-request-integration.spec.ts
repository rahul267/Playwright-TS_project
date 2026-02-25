import { test } from '../fixtures/test-fixtures';
import { expect } from '@playwright/test';
import { Request } from '../api/request';
// import { Response } from '../api/response';

// Example: Using withBody and withHeaders

test('POST /posts with body and headers', async ({ apiClient }) => {
  const req = new Request('/posts', 'POST')
    .withBody({ title: 'foo', body: 'bar', userId: 1 })
    .withHeaders({ 'Content-Type': 'application/json' });
  const res = await apiClient.send(req);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  console.log(res.body)
});

// Example: Using fromJsonFile

test('POST /posts with body from JSON file', async ({ apiClient }) => {
  const req = await Request.fromJsonFile('/posts', 'POST', './src/testdata/samples/post.json', {
    'Content-Type': 'application/json'
  });
  const res = await apiClient.send(req);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
});