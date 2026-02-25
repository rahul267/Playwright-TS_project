export class Response<T = any> {
  constructor(
    public status: number,
    public body: T,
    public headers?: Record<string, string>
  ) {}

  isStatus(expected: number): boolean {
    return this.status === expected;
  }

  hasHeader(key: string, value?: string): boolean {
    if (!this.headers) return false;
    const actual = Object.entries(this.headers).find(
      ([k]) => k.toLowerCase() === key.toLowerCase()
    );
    if (!actual) return false;
    if (value === undefined) return true;
    return actual[1] === value;
  }

  hasBodyProperty(prop: string, expectedValue?: any): boolean {
    if (!this.body || typeof this.body !== 'object') return false;
    if (!(prop in this.body)) return false;
    if (expectedValue === undefined) return true;
    return (this.body as any)[prop] === expectedValue;
  }
}