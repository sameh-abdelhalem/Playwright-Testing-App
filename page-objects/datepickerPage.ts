import { expect, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";
export class DatepickerPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    await this.page
      .locator("nb-card", { hasText: "Common Datepicker" })
      .getByPlaceholder("Form Picker")
      .click();
    // select the nb-card-body that has the attribute ng-reflect-ng-switch = date
    const expectedDateAssertion = await this.selectDateFromCalendar(
      numberOfDaysFromToday
    );
    await expect(
      this.page
        .locator("nb-card", { hasText: "Common Datepicker" })
        .getByRole("textbox")
    ).toHaveValue(expectedDateAssertion);
  }

  async selectDateRangeFromXDaysFromToday(
    numberOfDaysFromToday: number,
    numberOfDaysToAdd: number
  ) {
    await this.page
      .locator("nb-card", { hasText: "Datepicker With Range" })
      .getByPlaceholder("Range Picker")
      .click();
    // select the nb-card-body that has the attribute ng-reflect-ng-switch = date
    const expectedStartDateAssertion = await this.selectDateFromCalendar(
      numberOfDaysFromToday
    );

    const expectedEndDateAssertion = await this.selectDateFromCalendar(
      numberOfDaysToAdd
    );
    await expect(
      this.page
        .locator("nb-card", { hasText: "Datepicker With Range" })
        .getByRole("textbox")
    ).toHaveValue(
      `${expectedStartDateAssertion} - ${expectedEndDateAssertion}`
    );
  }
  private async selectDateFromCalendar(numberOfDaysFromToday: number) {
    const date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday); // add 7 days to the current date
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
    const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
    const expectedYear = date.getFullYear().toString();
    const expectedDateAssertion = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await this.page
      .locator("nb-calendar-view-mode")
      .textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page.locator(".next-month").click();
      calendarMonthAndYear = await this.page
        .locator("nb-calendar-view-mode")
        .textContent();
      await this.page.waitForTimeout(500); // wait for the calendar to update
    }
    await this.page
      .locator(".day-cell.ng-star-inserted:not(.bounding-month)")
      .getByText(expectedDate, { exact: true })
      .click();
    return expectedDateAssertion;
  }
}
