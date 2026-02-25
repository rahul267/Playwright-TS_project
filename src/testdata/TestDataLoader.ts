import { JsonUtility } from "../core/utilities/JsonUtility";
import { Logger } from "../logging/Logger";
import * as fs from 'fs/promises';

export class TestDataLoader {
  constructor(
    private readonly logger: Logger,
    private readonly jsonUtility: JsonUtility
  ) {}

  loadFromString<T>(rawJson: string): T {
    this.logger.info("Loading test data from JSON string");
    return this.jsonUtility.parse<T>(rawJson);
  }

  static async loadJson<T = any>(filePath: string): Promise<T> {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }
}
