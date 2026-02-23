import { expect, type Locator, type Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path = "/"): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoaded(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectUrlContains(pathSegment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(pathSegment));
  }
}
