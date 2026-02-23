import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { level: 1 });
  }

  async open(): Promise<void> {
    await this.navigate("/");
    await this.waitForPageLoaded();
  }

  async expectOnHomePage(): Promise<void> {
    await this.expectUrlContains("/");
  }

  async expectHeadingVisible(): Promise<void> {
    await this.expectVisible(this.heading);
  }
}
