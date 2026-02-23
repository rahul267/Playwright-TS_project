import type { FullConfig } from "@playwright/test";

async function globalSetup(_config: FullConfig): Promise<void> {
  console.log("[GlobalSetup] Initializing test run...");
}

export default globalSetup;
