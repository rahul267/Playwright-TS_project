import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { DriverException } from "../exceptions/Exceptions";
import { Logger } from "../logging/Logger";
import { Driver } from "./DriverFactory";

export class PlaywrightDriver implements Driver {
  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  private currentPage: Page | undefined;

  constructor(private readonly logger: Logger) {}

  async start(): Promise<void> {
    this.logger.info("Starting Playwright driver");
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.currentPage = await this.context.newPage();
  }

  get page(): Page {
    if (!this.currentPage) {
      throw new DriverException("Playwright page is not initialized. Call start() first.");
    }

    return this.currentPage;
  }

  async stop(): Promise<void> {
    this.logger.info("Stopping Playwright driver");
    await this.context?.close();
    await this.browser?.close();
    this.context = undefined;
    this.browser = undefined;
    this.currentPage = undefined;
  }
}
