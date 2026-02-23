import type { FullConfig } from "@playwright/test";

async function globalTeardown(_config: FullConfig): Promise<void> {
  console.log("[GlobalTeardown] Test run completed.");
}

export default globalTeardown;
