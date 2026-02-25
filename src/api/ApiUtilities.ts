import { Logger } from "../logging/Logger";

export interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  data?: unknown;
  timeoutMs?: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export class ApiUtilities {

  constructor(private readonly logger: Logger) {}

  async send<T = unknown>(request: ApiRequest): Promise<ApiResponse<T>> {
    this.logger.info(`API ${request.method} ${request.url}`);

    return {
      status: 200,
      headers: { "content-type": "application/json" },
      body: {} as T
    };
  }

}
