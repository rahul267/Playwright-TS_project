import { request } from "@playwright/test";

export async function runHealthCheck(baseUrl: string): Promise<boolean> {
  const context = await request.newContext({ baseURL: baseUrl });
  const response = await context.get("/");
  await context.dispose();
  return response.ok();
}
