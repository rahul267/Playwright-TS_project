
import type { APIRequestContext, APIResponse } from '@playwright/test';

// --- Local minimal types so we don't depend on version-specific exports ---

// Matches the "file" shape Playwright accepts in multipart payloads.
export type FilePayloadLite = {
  name?: string;           // form field name
  mimeType?: string;       // e.g., 'image/png'
  fileName?: string;       // file name to report
  buffer: Buffer | Uint8Array;
};

type Primitive = string | number | boolean | null | undefined;

export type QueryParams = Record<string, Primitive | Primitive[]>;
export type FormBody = Record<string, string | number | boolean>;
export type MultipartBody = Record<string, Primitive | FilePayloadLite>;

export interface RequestInput<TReq = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  path: string;

  headers?: Record<string, string>;
  params?: QueryParams;

  // pick one for body
  data?: TReq;                // JSON body
  form?: FormBody;            // application/x-www-form-urlencoded
  multipart?: MultipartBody;  // multipart/form-data

  timeout?: number;
  failOnStatusCode?: boolean; // default true
  retries?: number;
  retryDelayMs?: number;

  baseUrlOverride?: string;

  // Any extra Playwright request options you want to pass through.
  // We keep this untyped to support older versions.
  extra?: Record<string, unknown>;
}

export abstract class BaseApiPractice {
  constructor(protected request: APIRequestContext, protected baseUrl: string) {}

  protected async send<TResp = unknown, TReq = unknown>(
    input: RequestInput<TReq>
  ): Promise<{ response: APIResponse; json: TResp | null }> {
    const {
      method = 'GET',
      path,
      headers = {},
      params,
      data,
      form,
      multipart,
      timeout,
      failOnStatusCode = true,
      retries = 0,
      retryDelayMs = 500,
      baseUrlOverride,
      extra,
    } = input;

    const url = this.joinUrl(baseUrlOverride ?? this.baseUrl, path);

    const finalHeaders: Record<string, string> = { ...headers };
    if (data && !form && !multipart && !hasHeader(finalHeaders, 'content-type')) {
      finalHeaders['Content-Type'] = 'application/json';
    }

    const options: any = {
      method,
      headers: finalHeaders,
      params: normalizeParams(params),
      data,
      form,
      multipart,
      timeout,
      failOnStatusCode,
      ...(extra ?? {}),
    };

    let attempt = 0;
    let lastError: unknown;

    // Prefer request.fetch if available (newer Playwright)
    const canFetch = typeof (this.request as any).fetch === 'function';

    while (attempt <= retries) {
      try {
        const response: APIResponse = canFetch
          ? await (this.request as any).fetch(url, options)
          : await this._callVerb(method, url, options);

        // retry on 5xx
        if (attempt < retries && response.status() >= 500) {
          await delay(retryDelayMs * Math.pow(2, attempt));
          attempt++;
          continue;
        }

        return { response, json: await tryParseJson<TResp>(response) };
      } catch (err) {
        lastError = err;
        if (attempt >= retries) throw err;
        await delay(retryDelayMs * Math.pow(2, attempt));
        attempt++;
      }
    }
    throw lastError ?? new Error('Unknown error during API request');
  }

  // Verb helpers still available to services
  protected get<TResp = unknown>(
    path: string,
    opts?: Omit<RequestInput, 'method' | 'path' | 'data' | 'form' | 'multipart'>
  ) {
    return this.send<TResp>({ method: 'GET', path, ...opts });
  }
  protected post<TResp = unknown, TReq = unknown>(
    path: string,
    opts?: Omit<RequestInput<TReq>, 'method' | 'path'>
  ) {
    return this.send<TResp, TReq>({ method: 'POST', path, ...opts });
  }
  protected put<TResp = unknown, TReq = unknown>(
    path: string,
    opts?: Omit<RequestInput<TReq>, 'method' | 'path'>
  ) {
    return this.send<TResp, TReq>({ method: 'PUT', path, ...opts });
  }
  protected patch<TResp = unknown, TReq = unknown>(
    path: string,
    opts?: Omit<RequestInput<TReq>, 'method' | 'path'>
  ) {
    return this.send<TResp, TReq>({ method: 'PATCH', path, ...opts });
  }
  protected delete<TResp = unknown>(
    path: string,
    opts?: Omit<RequestInput, 'method' | 'path' | 'data' | 'form' | 'multipart'>
  ) {
    return this.send<TResp>({ method: 'DELETE', path, ...opts });
  }

  private joinUrl(base: string, path: string) {
    if (!base.endsWith('/') && !path.startsWith('/')) return `${base}/${path}`;
    if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1);
    return base + path;
  }

  // Fallback for older Playwright without request.fetch
  private async _callVerb(method: string, url: string, options: any): Promise<APIResponse> {
    switch (method.toUpperCase()) {
      case 'GET':
        return this.request.get(url, options);
      case 'POST':
        return this.request.post(url, options);
      case 'PUT':
        return this.request.put(url, options);
      case 'PATCH':
        return this.request.patch(url, options);
      case 'DELETE':
        return this.request.delete(url, options);
      case 'HEAD':
        return (this.request as any).fetch
          ? (this.request as any).fetch(url, { ...options, method: 'HEAD' })
          : this.request.get(url, { ...options, method: 'HEAD' } as any);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}

function hasHeader(h: Record<string, string>, name: string) {
  const n = name.toLowerCase();
  return Object.keys(h).some((k) => k.toLowerCase() === n);
}

function normalizeParams(params?: QueryParams): Record<string, string> | undefined {
  if (!params) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) out[k] = v.map((x) => String(x)).join(',');
    else out[k] = String(v);
  }
  return out;
}

async function tryParseJson<T>(resp: APIResponse): Promise<T | null> {
  const ct = resp.headers()['content-type'] ?? '';
  if (ct.toLowerCase().includes('application/json')) {
    try {
      return (await resp.json()) as T;
    } catch {
      return null;
    }
  }
  return null;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));