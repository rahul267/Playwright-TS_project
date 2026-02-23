import { Logger } from "../logging/Logger";
import { PlaywrightDriver } from "./PlaywrightDriver";

export type DriverType = "ui" | "api" | "mobile" | "playwright";

export interface Driver {
  start(): Promise<void>;
  stop(): Promise<void>;
}

class NoopDriver implements Driver {
  async start(): Promise<void> {
    return;
  }

  async stop(): Promise<void> {
    return;
  }
}

export class DriverFactory {
  constructor(private readonly logger: Logger) {}

  create(driverType: DriverType): Driver {
    this.logger.info(`Creating driver type=${driverType}`);

    if (driverType === "playwright" || driverType === "ui") {
      return new PlaywrightDriver(this.logger);
    }

    return new NoopDriver();
  }
}
