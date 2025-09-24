import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("submit form using the grid", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();

  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      process.env.USERNAME,
      process.env.PASSWORD,
      "Option 2"
    );

  await page.screenshot({ path: "screenshots/formLayoutsPage.png" });
  await page
    .locator("nb-card", {
      hasText: "Inline form",
    })
    .screenshot({ path: "screenshots/inlineForm.png" });
  const buffer = await page.screenshot();
  console.log(buffer.toString("base64"));
});

test("submit Inline form", async ({ page }) => {
  const { faker } = await import("@faker-js/faker");
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName
    .replace(/\s+/g, "")
    .toLowerCase()}${faker.number.int(1000)}@test.com`;
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();

  await pm
    .onFormLayoutsPage()
    .submitInlineForm(randomFullName, randomEmail, true);
});
test("pick Date from today", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().datePickerPage();

  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5);
});
test("pick Date Range from today", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().datePickerPage();

  await pm.onDatepickerPage().selectDateRangeFromXDaysFromToday(5, 10);
});
