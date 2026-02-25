import fs from 'fs';

export class Request<T = any> {
  constructor(
    public url: string,
    public method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    public data?: T,
    public headers?: Record<string, string>
  ) {}

  // Set the request body (generic)
  withBody<B>(body: B): Request<B> {
    return new Request<B>(this.url, this.method, body, this.headers);
  }

  // Set the request headers
  withHeaders(headers: Record<string, string>): Request<T> {
    return new Request<T>(this.url, this.method, this.data, headers);
  }

  // Set the request body from a JSON file (async)
  static async fromJsonFile(url: string, method: 'POST' | 'PUT' | 'PATCH', filePath: string, headers?: Record<string, string>): Promise<Request<any>> {
    // const fs = await import('fs/promises');
    const data = JSON.parse(await fs.readFileSync(filePath, 'utf-8'));
    return new Request(url, method, data, headers);
  }
}