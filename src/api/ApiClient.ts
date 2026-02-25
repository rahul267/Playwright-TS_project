import { APIRequestContext, request } from '@playwright/test';
import { ApiRequest, ApiResponse } from './ApiUtilities';


export class ApiClient {
    private requestContext: APIRequestContext;

    private constructor(requestContext: APIRequestContext) {
        this.requestContext = requestContext;
    }

    static async create(baseURL: string) {
        const requestContext = await request.newContext({ baseURL });
        return new ApiClient(requestContext);
    }

    async get(path: string, headers: Record<string, string> = {}) {
        return this.requestContext.get(path, { headers });
    }

    async post(path: string, data: any, headers: Record<string, string> = {}) {
        return this.requestContext.post(path, { data, headers });
    }

    async put(path: string, data: any, headers: Record<string, string> = {}) {
        return this.requestContext.put(path, { data, headers });
    }

    async delete(path: string, headers: Record<string, string> = {}) {
        return this.requestContext.delete(path, { headers });
    }


    async send<T = unknown>(req: ApiRequest): Promise<ApiResponse<T>> {
        const { method, url, headers, data } = req;
        const res = await this.requestContext.fetch(url, {
            method,
            data,
            headers
        });
        const body = await res.json();
        return {
            status: res.status(),
            headers: res.headers(),
            body: body as T
        };
    }


}