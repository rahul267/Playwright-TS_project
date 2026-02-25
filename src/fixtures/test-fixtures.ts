import { test as base } from "@playwright/test";
import { getSearchTestInputs } from "../api/utils/dbQueries";
import { SearchRequest } from "../api/utils/types";

import { ApiClient } from '../api/ApiClient';
import { Request } from '../api/request';
import { Response } from '../api/response';
import { env } from '../api/utils/env'



type ApiFixtures = {
  searchRequest: SearchRequest;
  apiClient: ApiClient;
  requestObj: Request;
  responseObj: Response;
};

export const test = base.extend<ApiFixtures>({
  searchRequest: async ({}, use) => {
    const dbData = await getSearchTestInputs();
    await use({
      clientId: dbData.id,
      searchType: "claim",
      limit: 10
    });
  },

  apiClient: async ({}, use) => {
    const client = await ApiClient.create(env.apiBaseURL);
    await use(client);
  },

  requestObj: async ({}, use) => {
    // Example: default GET request, can be overridden in tests
    const req = new Request(env.baseURL, 'GET');
    await use(req);
  },

  responseObj: async ({}, use) => {
    // Placeholder, will be set in test after sending request
    await use(undefined as any);
  }
  
});

export { expect } from "@playwright/test";
export { Request, Response };
