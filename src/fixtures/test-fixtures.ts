import { test as base } from "@playwright/test";
import { getSearchTestInputs } from "../api/utils/dbQueries";
import { SearchRequest } from "../api/utils/types";

type ApiFixtures = {
  searchRequest: SearchRequest;
};

export const test = base.extend<ApiFixtures>({
  searchRequest: async ({}, use) => {
    const dbData = await getSearchTestInputs();
    await use({
      clientId: dbData.id,
      searchType: "claim",
      limit: 10
    });
  }
});

export { expect } from "@playwright/test";
