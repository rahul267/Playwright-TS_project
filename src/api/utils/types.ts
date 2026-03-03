export interface SearchRequest {
  clientId: string;
  searchType: "claim" | "product" | "policy";
  limit: number;
}

export interface SearchInputFromDb {
  id: string;
}

import type { APIResponse } from '@playwright/test';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FilePayload {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export type ArrayStyle = 'repeat' | 'comma' | 'space';

export interface RequestOptions {
  pathParams?: Record<string, string | number | boolean>;
  query?: Record<string, unknown>;
  rawQuery?: string | URLSearchParams;
  headers?: Record<string, string>;
  json?: unknown;
  form?: Record<string, string | number | boolean>;
  multipart?: Record<string, string | number | boolean | FilePayload>;
  timeoutMs?: number;
  failOnStatusCode?: boolean;        // default true
  retries?: number;                  // default 0
  retryBackoffMs?: number;           // default 300
  arrayStyle?: ArrayStyle;           // default 'repeat'
  // Optional decoder (overrides default JSON parse)
  decoder?: (response: APIResponse) => Promise<unknown>;
  // Optional Zod-like validator (runtime check)
  validator?: { parse: (x: unknown) => unknown };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
    public bodyText?: string,
    public headers?: Record<string, string>
  ) {
    super(message);
  }
}

export type ApiResult<T> = { response: APIResponse; data?: T };
