import { Page } from "@playwright/test";
export class FormLayoutsPage {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async submitUsingTheGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionText: string
  ) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    const usingTheGridEmailInput = usingTheGridForm.getByRole("textbox", {
      name: "Email",
    });
    const usingTheGridPasswordInput = usingTheGridForm.getByRole("textbox", {
      name: "Password",
    });
    const usingTheGridOption = usingTheGridForm.getByRole("radio", {
      name: optionText,
    });

    await usingTheGridEmailInput.fill(email);
    await usingTheGridPasswordInput.fill(password);
    await usingTheGridOption.check({ force: true });
    await usingTheGridForm.getByRole("button", { name: "Sign In" }).click();
  }
  /**
   * This function fills and submits the inline form
   * @param name first name and last name
   * @param email email address
   * @param RememberMeCheckbox true = check , false = uncheck
   */
  async submitInlineForm(
    name: string,
    email: string,
    RememberMeCheckbox: boolean
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline form",
    });
    const inlineFormNameInput = inlineForm.getByPlaceholder("Jane Doe");
    const inlineFormEmailInput = inlineForm.getByRole("textbox", {
      name: "Email",
    });

    const inlineFormRememberMeCheckbox = inlineForm.getByRole("checkbox");

    await inlineFormNameInput.fill(name);
    await inlineFormEmailInput.fill(email);
    if (RememberMeCheckbox) {
      inlineFormRememberMeCheckbox.check({ force: true });
    } else {
      inlineFormRememberMeCheckbox.uncheck({ force: true });
    }
    await inlineForm.getByRole("button", { name: "Submit" }).click();
  }
}
