import { test } from "../test-options";
import { PageManager } from "../page-objects/pageManager";



test("submit Inline form", async ({ page }) => {
  const { faker } = await import("@faker-js/faker");
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName
    .replace(/\s+/g, "")
    .toLowerCase()}${faker.number.int(1000)}@test.com`;
  const pm = new PageManager(page);

  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      process.env.USERNAME,
      process.env.PASSWORD,
      "Option 2"
    );
  await pm
    .onFormLayoutsPage()
    .submitInlineForm(randomFullName, randomEmail, true);
});
