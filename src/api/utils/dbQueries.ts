import { SearchInputFromDb } from "./types";

export async function getSearchTestInputs(): Promise<SearchInputFromDb> {
  return {
    id: "dynamic-client-id-from-db"
  };
}
