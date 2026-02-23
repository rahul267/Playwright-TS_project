import { JsonUtility } from "../core/utilities/JsonUtility";
import { Logger } from "../logging/Logger";

export class TestDataLoader {
  constructor(
    private readonly logger: Logger,
    private readonly jsonUtility: JsonUtility
  ) {}

  loadFromString<T>(rawJson: string): T {
    this.logger.info("Loading test data from JSON string");
    return this.jsonUtility.parse<T>(rawJson);
  }
}
