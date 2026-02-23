import { SearchRequest } from "./types";

export function getSearchPayload(input: SearchRequest): Record<string, string | number | boolean> {
  return {
    clientId: input.clientId,
    type: input.searchType,
    limit: input.limit
  };
}
