import { expect, test } from "@playwright/test";
import { log } from "console";
import { NavigationPage } from "../page-objects/navigationPage";
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe.only("Form Layouts page", () => {
  test.describe.configure({ retries: 2 });
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }, testInfo) => {
    if (testInfo.retry) {
      // do something before retry
    }
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });
    console.log(usingTheGridEmailInput);
    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 500,
    });

    //generic assertion

    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    //locator assertion

    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    // await usingTheGridForm.getByLabel("Option 1").check({ force: true });
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });
    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked();
    expect(radioStatus).toBeTruthy();

    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    expect(
      usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked()
    ).toBeTruthy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();
  });
});

test.describe("Checkboxes", () => {
  test.beforeEach(async ({ page }) => {
    const navigateTo = new NavigationPage(page);
    await navigateTo.toastrPage();
  });

  test("checkboxes", async ({ page }) => {
    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .uncheck({ force: true });
    await page
      .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
      .check({ force: true });

    const allCheckBoxes = page.getByRole("checkbox");

    for (const box of await allCheckBoxes.all()) {
      await box.uncheck({ force: true });

      expect(await box.isChecked()).toBeFalsy();
    }
  });

  // lists

  test("lists", async ({ page }) => {
    const dropDownMenu = page.locator("ngx-header nb-select");

    await dropDownMenu.click();
    // const optionList = page.getByRole("list").locator("nb-option");

    const optionList = page.locator("nb-option-list nb-option");
    await expect(optionList).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]);

    await optionList.filter({ hasText: "Cosmic" }).click();
    const header = page.locator("nb-layout-header");
    expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

    const colors = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };

    for (const color in colors) {
      await dropDownMenu.click();
      await optionList.filter({ hasText: color }).click();
      expect(header).toHaveCSS("background-color", colors[color]);
    }
  });
});

test("tooltips", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.tooltipPage();

  const toolTopCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTopCard.getByRole("button", { name: "Top" }).hover();
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });
  const tableRow = page.locator("tr", { hasText: "mdo@gmail.com" });
  await tableRow.locator(".nb-trash").click();

  await expect(page.locator("tbody tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

test("table", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.smartTablePage();

  const tableRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await tableRow.locator(".nb-edit").click();

  const ageInput = tableRow.locator("input[placeholder='Age']");
  await ageInput.fill("35");
  await tableRow.locator(".nb-checkmark").click();

  // second edit scenario based on id
  const paginationNavLocator = page.locator(".ng2-smart-pagination-nav");
  await paginationNavLocator.getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();

  await page
    .locator("input-editor")
    .getByPlaceholder("E-mail")
    .fill("test@test.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  //test table filtering
  const ages = ["20", "30", "40", "200"];
  const searchField = page.getByRole("row").locator("input[placeholder='Age']");
  for (let age of ages) {
    await searchField.fill(age);
    // wait for search to be done
    await page.waitForTimeout(500);

    const filteredRows = page.locator("tbody tr");
    // loop threw rows and check age
    for (let row of await filteredRows.all()) {
      const cellValue = await row.locator("td").last().textContent();
      if (age == "200") {
        expect(cellValue).toEqual(" No data found ");
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("datepicker", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.datePickerPage();

  await page
    .locator("nb-card", { hasText: "Common Datepicker" })
    .getByPlaceholder("Form Picker")
    .click();
  // select the nb-card-body that has the attribute ng-reflect-ng-switch = date
  const date = new Date();
  date.setDate(date.getDate() + 50); // add 7 days to the current date
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear().toString();
  const expectedDateAssertion = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;
  const monthDaysLocator = await page.locator(
    "[class='day-cell ng-star-inserted']"
  );

  let calendarMonthAndYear = await page
    .locator("nb-calendar-view-mode")
    .textContent();
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
    await page.locator(".next-month").click();
    calendarMonthAndYear = await page
      .locator("nb-calendar-view-mode")
      .textContent();
    await page.waitForTimeout(500); // wait for the calendar to update
  }
  await page
    .locator("[class='day-cell ng-star-inserted']")
    .getByText(expectedDate, { exact: true })
    .click();
  await expect(
    page
      .locator("nb-card", { hasText: "Common Datepicker" })
      .getByRole("textbox")
  ).toHaveValue(expectedDateAssertion);
});

test("sliders", async ({ page }) => {
  // const tempCircleLocator = page
  //   .locator("ngx-temperature-dragger", { hasText: "Celsius" })
  //   .locator("circle");

  // await tempCircleLocator.evaluate((node) => {
  //   node.setAttribute("cx", "232.63098833543773");
  //   node.setAttribute("cy", "232.63098833543773");
  // });
  // await tempCircleLocator.click();

  //Mouse movements
  const tempBox = page.locator("ngx-temperature-dragger", {
    hasText: "Celsius",
  });
  await tempBox.scrollIntoViewIfNeeded();

  const box = await tempBox.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y);
  await page.mouse.move(x + 100, y + 100);
  await page.mouse.up();

  await expect(tempBox).toContainText("30");
});
