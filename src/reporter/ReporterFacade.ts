import { Logger } from "../logging/Logger";

export interface TestResult {
  testName: string;
  status: "passed" | "failed" | "skipped";
  durationMs: number;
  errorMessage?: string;
}

export interface Reporter {
  onTestStart(testName: string): void;
  onTestFinish(result: TestResult): void;
}

export class ConsoleReporter implements Reporter {
  onTestStart(testName: string): void {
    console.log(`TEST START: ${testName}`);
  }

  onTestFinish(result: TestResult): void {
    console.log("TEST FINISH:", result);
  }
}

export class ReporterFacade {
  constructor(
    private readonly reporters: Reporter[],
    private readonly logger: Logger
  ) {}

  testStarted(testName: string): void {
    this.logger.info(`ReporterFacade start test=${testName}`);
    this.reporters.forEach((reporter) => reporter.onTestStart(testName));
  }

  testFinished(result: TestResult): void {
    this.logger.info(`ReporterFacade finish test=${result.testName}`);
    this.reporters.forEach((reporter) => reporter.onTestFinish(result));
  }
}
