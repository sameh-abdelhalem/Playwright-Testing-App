import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutsPage } from "../page-objects/formLayoutsPage";
import { DatepickerPage } from "../page-objects/datepickerPage";
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formLayoutsPage();
  await navigateTo.datePickerPage();
  await navigateTo.smartTablePage();
  await navigateTo.toastrPage();
  await navigateTo.tooltipPage();
});

test("submit form using the grid", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formLayoutsPage();

  const formLayoutsPage = new FormLayoutsPage(page);
  await formLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption(
    "test@test.com",
    "password",
    "Option 2"
  );
});

test("submit Inline form", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formLayoutsPage();

  const formLayoutsPage = new FormLayoutsPage(page);
  await formLayoutsPage.submitInlineForm(
    "Jane Doe",
    "jane.doe@example.com",
    true
  );
});
test("pick Date from today", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.datePickerPage();

  const datepickerPage = new DatepickerPage(page);
  await datepickerPage.selectCommonDatePickerDateFromToday(5);
});
test("pick Date Range from today", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.datePickerPage();

  const datepickerPage = new DatepickerPage(page);
  await datepickerPage.selectDateRangeFromXDaysFromToday(5, 10);
});
