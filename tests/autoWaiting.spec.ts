import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto(process.env.URL);
  await page
    .locator("button")
    .filter({ hasText: "Button Triggering AJAX Request" })
    .click();
  testInfo.setTimeout(testInfo.timeout + 2000);
});

// find data loaded section

test("auto waiting", async ({ page }) => {
  await page.getByText("Button Triggering AJAX Request").click();
  const successButton = page.locator(".bg-success");
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test.skip("alternative ways", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  // wait for element
  // await page.waitForSelector(".bg-success");

  //wait for particular response
  // await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  //wait for network calls to be completed ("NOT Recommended")
  await page.waitForLoadState("networkidle");
  const text = await successButton.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});

test.skip("timeouts", async ({ page }) => {
  test.slow();
  const successButton = page.locator(".bg-success");
  await successButton.click({ timeout: 16000 });
});
