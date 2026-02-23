import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";

function loadEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV ?? "qa";

  switch (nodeEnv) {
    case "local":
      dotenv.config({ path: "./environments/local.env" });
      break;
    case "dev":
      dotenv.config({ path: "./environments/dev.env" });
      break;
    case "qa":
      dotenv.config({ path: "./environments/qa.env" });
      break;
    default:
      dotenv.config({ path: "./environments/qa.env" });
      break;
  }
}

loadEnvironment();

export default defineConfig({
  testDir: "./src",
  timeout: 30_000,
  fullyParallel: true,
  retries: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright", { outputFolder: "allure-results" }]
  ],
  globalSetup: "./src/globals/global-setup.ts",
  globalTeardown: "./src/globals/global-teardown.ts",
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" }
    },
    {
      name: "api",
      use: { browserName: "chromium" },
      grep: /@api/
    },
    {
      name: "ui",
      use: { browserName: "chromium" },
      grep: /@ui/
    },
    {
      name: "e2e",
      use: { browserName: "chromium" },
      grep: /@e2e/
    }
  ]
});
