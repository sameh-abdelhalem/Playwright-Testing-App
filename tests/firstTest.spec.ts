import { test } from "@playwright/test";

test("first test", async ({ page }) => {
  await page.goto("http://localhost:4200/");
});
