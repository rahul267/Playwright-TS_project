import { APIResponse } from '@playwright/test';

export class ApiLogger {
  static async logRequest(method: string, url: string, headers?: Record<string, string>, body?: any) {
     
    console.log(`[API REQUEST] ${method} ${url}`);
    if (headers) console.log('Headers:', headers);
    if (body) console.log('Body:', body);
  }

  static async logResponse(response: APIResponse) {
     
    console.log(`[API RESPONSE] Status: ${response.status()}`);
    const headers = response.headers();
    if (headers) console.log('Headers:', headers);
    try {
      const body = await response.json();
      console.log('Body:', body);
    } catch {
      // Not all responses are JSON
    }
  }
}