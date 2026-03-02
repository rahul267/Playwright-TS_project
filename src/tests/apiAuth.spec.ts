// tests/api-auth.spec.ts
import { test, expect } from "@playwright/test";
import { ApiUtilities } from "../api/ApiUtilities";
import { ConsoleLogger } from "../logging/Logger";
test("API utility with JWT and OAuth", async () => {
  const logger = new ConsoleLogger("debug");
  const api = new ApiUtilities(logger, {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    tokenEndpoint: "https://auth.example.com/oauth/token",
    jwksUri: "https://auth.example.com/.well-known/jwks.json",
    jwtSecret: new TextEncoder().encode("super-secret-key"),
  });

  // 🔑 JWT request
  const jwtResponse = await api.send({
    method: "GET",
    url: "https://api.example.com/jwt-protected",
    useJWT: true,
  });
  expect(jwtResponse.status).toBe(200);

  // 🌐 OAuth request
  const oauthResponse = await api.send({
    method: "GET",
    url: "https://api.example.com/oauth-protected",
    useOAuth: true,
  });
  expect(oauthResponse.status).toBe(200);
});
