// tests/api-auth.spec.ts
import { test, expect } from "@playwright/test";
import { ApiUtilities } from "../api/ApiUtilities";
import { ConsoleLogger } from "../logging/Logger";
test("API utility with JWT and OAuth", async () => {
  const logger = new ConsoleLogger("debug");
  const api = new ApiUtilities(logger, {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    tokenEndpoint: "https://oauth.mock.beeceptor.com/token",
    jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
    jwtSecret: new TextEncoder().encode("super-secret-key"),
  });

  // 🔑 JWT request
  const jwtResponse = await api.send({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    useJWT: true,
  });
  expect(jwtResponse.status).toBe(200);

  // 🌐 OAuth request
  const oauthResponse = await api.send({
    method: "GET",
    url: "https://oauth.mock.beeceptor.com/resource",
    useOAuth: true,
  });
  expect(oauthResponse.status).toBe(200);
});
