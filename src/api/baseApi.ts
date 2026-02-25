import { APIRequestContext, request } from '@playwright/test';
import { getEnvConfig } from '../api/utils/env';

export class BaseApiTest {
  apiContext!: APIRequestContext;
  baseUrl: string;

  constructor() {
    this.baseUrl = getEnvConfig().BASE_URL;
  }

  async init() {
    this.apiContext = await request.newContext({
      baseURL: this.baseUrl,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
  }

  async dispose() {
    await this.apiContext.dispose();
  }
}