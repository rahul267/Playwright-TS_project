import { expect, test } from "@playwright/test";

test("validate title and status page @e2e @sanity", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Example Domain/i);

  const response = await request.get("https://jsonplaceholder.typicode.com/posts/1");
  expect(response.ok()).toBeTruthy();
});
