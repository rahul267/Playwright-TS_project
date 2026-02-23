import { ApiUtilities } from "../api/ApiUtilities";
import { JsonUtility } from "./utilities/JsonUtility";
import { DatabaseClient } from "../db/DatabaseClient";
import { DriverFactory } from "../driver/DriverFactory";
import { KafkaClient } from "../kafka/KafkaClient";
import { ConsoleLogger, Logger } from "../logging/Logger";
import { ConsoleReporter, ReporterFacade } from "../reporter/ReporterFacade";
import { TestDataLoader } from "../testdata/TestDataLoader";

export class FrameworkContext {
  readonly logger: Logger;
  readonly jsonUtility: JsonUtility;
  readonly apiUtilities: ApiUtilities;
  readonly kafkaClient: KafkaClient;
  readonly databaseClient: DatabaseClient;
  readonly testDataLoader: TestDataLoader;
  readonly driverFactory: DriverFactory;
  readonly reporterFacade: ReporterFacade;

  constructor() {
    this.logger = new ConsoleLogger("info");
    this.jsonUtility = new JsonUtility();
    this.apiUtilities = new ApiUtilities(this.logger);
    this.kafkaClient = new KafkaClient(this.logger);
    this.databaseClient = new DatabaseClient(this.logger);
    this.testDataLoader = new TestDataLoader(this.logger, this.jsonUtility);
    this.driverFactory = new DriverFactory(this.logger);
    this.reporterFacade = new ReporterFacade([new ConsoleReporter()], this.logger);
  }
}
