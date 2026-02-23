import { test } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("UI smoke", () => {
  test("validate homepage heading @ui @regression", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.expectOnHomePage();
    await homePage.expectHeadingVisible();
  });
});
