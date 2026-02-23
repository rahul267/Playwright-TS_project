import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test, expect } from "@playwright/test";
import { Test as TestAnnotation, getTestMetadata } from "../annotations/Test";
import { FrameworkContext } from "../core/FrameworkContext";
import { CoreUtilities } from "../core/utilities/CoreUtilities";
import { JsonUtility } from "../core/utilities/JsonUtility";
import { FrameworkException } from "../exceptions/Exceptions";
import { Reporter, ReporterFacade, TestResult } from "../reporter/ReporterFacade";

class InMemoryReporter implements Reporter {
  starts: string[] = [];
  finishes: TestResult[] = [];

  onTestStart(testName: string): void {
    this.starts.push(testName);
  }

  onTestFinish(result: TestResult): void {
    this.finishes.push(result);
  }
}

class AnnotatedTests {
  @TestAnnotation({ id: "DEMO-101", tags: ["showcase", "metadata"], owner: "qa-arch", severity: "medium" })
  runAnnotatedScenario(): void {
    return;
  }
}

test.describe("Framework core showcase", () => {
  test("showcases annotations metadata retrieval @framework @showcase", async () => {
    const demo = new AnnotatedTests();
    demo.runAnnotatedScenario();

    const metadata = getTestMetadata("runAnnotatedScenario");

    expect(metadata?.id).toBe("DEMO-101");
    expect(metadata?.tags).toContain("showcase");
    expect(metadata?.owner).toBe("qa-arch");
    expect(metadata?.severity).toBe("medium");
  });

  test("showcases test data loader and json utility @framework @showcase", async () => {
    const context = new FrameworkContext();
    const filePath = join(process.cwd(), "src", "testdata", "samples", "search-request.json");
    const raw = await readFile(filePath, "utf-8");

    const payload = context.testDataLoader.loadFromString<{
      clientId: string;
      searchType: string;
      limit: number;
    }>(raw);

    expect(payload.clientId).toBe("sample-client-001");
    expect(payload.searchType).toBe("claim");
    expect(payload.limit).toBe(25);

    const pretty = context.jsonUtility.stringify(payload, true);
    expect(pretty).toContain("sample-client-001");
  });

  test("showcases reporter facade fan-out @framework @showcase", async () => {
    const context = new FrameworkContext();
    const inMemory = new InMemoryReporter();
    const reporterFacade = new ReporterFacade([inMemory], context.logger);
    const testName = "reporter-facade-demo";

    reporterFacade.testStarted(testName);
    reporterFacade.testFinished({
      testName,
      status: "passed",
      durationMs: 15
    });

    expect(inMemory.starts).toEqual([testName]);
    expect(inMemory.finishes).toHaveLength(1);
    expect(inMemory.finishes[0]?.status).toBe("passed");
  });

  test("showcases core utilities and exception handling @framework @showcase", async () => {
    const generatedId = CoreUtilities.generateId("demo");
    expect(generatedId.startsWith("demo-")).toBeTruthy();

    const timestamp = CoreUtilities.timestamp();
    expect(timestamp).toContain("T");

    await CoreUtilities.delay(1);

    const jsonUtility = new JsonUtility();
    expect(() => jsonUtility.parse("{invalid-json}")).toThrow(FrameworkException);
  });
});
