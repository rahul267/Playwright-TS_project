import { Logger } from "../logging/Logger";
import { SignJWT, jwtVerify, createRemoteJWKSet,JWTPayload } from "jose";

export interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  useOAuth?: boolean; // flag to use OAuth 2.0
  useJWT?: boolean;   // flag to use JWT
}

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export class ApiUtilities {
  constructor(
    private readonly logger: Logger,
    private readonly config: {
      clientId: string;
      clientSecret: string;
      tokenEndpoint: string;
      jwksUri: string;
      jwtSecret: Uint8Array;
    }
  ) {}

  /** 🔑 Create JWT for testing or internal auth */ 
  async createJWT(payload: JWTPayload): Promise<string> { 
    return await new SignJWT(payload) 
    .setProtectedHeader({ alg: "HS256" }) 
    .setIssuedAt() .setExpirationTime("2h") 
    .sign(this.config.jwtSecret); }

  /** ✅ Verify JWT */
  async verifyJWT(token: string) {
    const { payload } = await jwtVerify(token, this.config.jwtSecret);
    return payload;
  }

  /** 🌐 Get OAuth 2.0 token */
  async getOAuthToken(): Promise<string> {
    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        audience: "https://your-api-identifier",
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth token request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /** 🔒 Verify OAuth token using JWKS */
  async verifyOAuthToken(token: string) {
    const JWKS = createRemoteJWKSet(new URL(this.config.jwksUri));
    const { payload } = await jwtVerify(token, JWKS);
    return payload;
  }

  /** 🚀 Send API request with optional JWT or OAuth */
  async send<T = unknown>(request: ApiRequest): Promise<ApiResponse<T>> {
    this.logger.info(`API ${request.method} ${request.url}`);

    let headers = { ...(request.headers || {}) };

    if (request.useJWT) {
      const jwt = await this.createJWT({ role: "tester" });
      headers["Authorization"] = `Bearer ${jwt}`;
    }

    if (request.useOAuth) {
      const token = await this.getOAuthToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(request.url, {
      method: request.method,
      headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    const body = await response.json().catch(() => ({}));

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: body as T,
    };
  }
}
