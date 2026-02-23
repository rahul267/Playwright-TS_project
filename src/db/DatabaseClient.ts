import { Logger } from "../logging/Logger";

export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
}

export class DatabaseClient {
  constructor(private readonly logger: Logger) {}

  async query<T = unknown>(_sql: string, _params: unknown[] = []): Promise<QueryResult<T>> {
    this.logger.info("Database query executed");
    return { rows: [], rowCount: 0 };
  }
}
