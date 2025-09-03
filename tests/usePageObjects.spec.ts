import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutsPage } from "../page-objects/formLayoutsPage";
import { DatepickerPage } from "../page-objects/datepickerPage";
import { PageManager } from "../page-objects/pageManager";
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
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
      "test@test.com",
      "password",
      "Option 2"
    );
});

test("submit Inline form", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();

  await pm
    .onFormLayoutsPage()
    .submitInlineForm("Jane Doe", "jane.doe@example.com", true);
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
