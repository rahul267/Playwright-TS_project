import * as fs from "fs";
import * as path from "path";
import { JsonUtility } from "../core/utilities/JsonUtility";
import { Logger } from "../logging/Logger";

export class TestDataLoader {
  static loadJson(fileName: string): any {
    const filePath = path.resolve(process.cwd(), "src", "testdata", fileName);
    const rawJson = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawJson);
  }
  constructor(
    private readonly logger: Logger,
    private readonly jsonUtility: JsonUtility
  ) {}

  loadFromString<T>(rawJson: string): T {
    this.logger.info("Loading test data from JSON string");
    return this.jsonUtility.parse<T>(rawJson);
  }
}
