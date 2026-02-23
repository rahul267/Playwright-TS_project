import { expect, test } from "../fixtures/test-fixtures";
import { getSearchPayload } from "./utils/payloadBuilder";
import { getSearchUrl } from "./utils/urlBuilder";

test.describe("Search API", () => {
  test("validate search endpoint with fixture data @api @regression", async ({ request, searchRequest }) => {
    const apiBaseUrl = process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com";
    const url = getSearchUrl(apiBaseUrl);

    const response = await request.get(url, {
      params: getSearchPayload(searchRequest)
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
