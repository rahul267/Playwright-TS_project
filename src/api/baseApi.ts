import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseApi {
  constructor(protected request: APIRequestContext, protected baseUrl: string) {}

  protected async get(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${path}`, { headers });
  }

  protected async post(path: string, data?: object, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${path}`, { data, headers });
  }

  protected async put(path: string, data?: object, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${path}`, { data, headers });
  }

  protected async patch(path: string, data?: object, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.patch(`${this.baseUrl}${path}`, { data, headers });
  }

  protected async delete(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${path}`, { headers });
  }
}