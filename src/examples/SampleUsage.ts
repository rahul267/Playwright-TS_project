import { Test, getTestMetadata } from "../annotations/Test";
import { FrameworkContext } from "../core/FrameworkContext";

class SmokeTests {
  private readonly context = new FrameworkContext();

  @Test({ id: "TC-001", tags: ["smoke", "api"], owner: "qa-team", severity: "high" })
  async shouldValidateApiAndReport(): Promise<void> {
    const testName = "shouldValidateApiAndReport";
    const startedAt = Date.now();
    this.context.reporterFacade.testStarted(testName);

    await this.context.apiUtilities.send({
      method: "GET",
      url: "https://example.internal/health"
    });

    const meta = getTestMetadata(testName);
    this.context.logger.info("Test metadata", meta);

    this.context.reporterFacade.testFinished({
      testName,
      status: "passed",
      durationMs: Date.now() - startedAt
    });
  }
}

export async function runSample(): Promise<void> {
  const tests = new SmokeTests();
  await tests.shouldValidateApiAndReport();
}