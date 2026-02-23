import { test, expect } from "@playwright/test";
import { FrameworkContext } from "../core/FrameworkContext";
import { PlaywrightDriver } from "../driver/PlaywrightDriver";
import { DriverException } from "../exceptions/Exceptions";

test.describe("Integrations showcase", () => {
  test("showcases API utility response contract @api @showcase", async () => {
    const context = new FrameworkContext();
    const response = await context.apiUtilities.send<{ ok: boolean }>({
      method: "GET",
      url: `${process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com"}/posts/1`
    });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("showcases DB and Kafka utilities interaction points @api @showcase", async () => {
    const context = new FrameworkContext();

    const dbResult = await context.databaseClient.query("select 1", []);
    expect(dbResult.rowCount).toBe(0);
    expect(dbResult.rows).toEqual([]);

    await context.kafkaClient.publish("demo-topic", {
      key: "sample-key",
      value: "sample-value"
    });
    const consumed = await context.kafkaClient.consume("demo-topic", 3);
    expect(consumed).toEqual([]);
  });

  test("showcases driver factory for Playwright and fallback drivers @ui @showcase", async () => {
    const context = new FrameworkContext();

    const uiDriver = context.driverFactory.create("ui");
    expect(uiDriver).toBeInstanceOf(PlaywrightDriver);

    const apiDriver = context.driverFactory.create("api");
    await expect(apiDriver.start()).resolves.toBeUndefined();
    await expect(apiDriver.stop()).resolves.toBeUndefined();

    const playwrightDriver = context.driverFactory.create("playwright") as PlaywrightDriver;
    expect(() => playwrightDriver.page).toThrow(DriverException);
  });
});
