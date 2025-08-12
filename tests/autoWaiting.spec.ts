import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

// find data loaded section

test("auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  // await successButton.click();
  // const text = await successButton.textContent();
  // await successButton.waitFor({ state: "attached" });
  // const text = await successButton.allTextContents();
  // expect(text).toContain("Data loaded with AJAX get request.");
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test("alternative ways", async ({ page }) => {
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
