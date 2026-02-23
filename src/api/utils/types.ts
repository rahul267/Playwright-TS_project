export interface SearchRequest {
  clientId: string;
  searchType: "claim" | "product" | "policy";
  limit: number;
}

export interface SearchInputFromDb {
  id: string;
}
