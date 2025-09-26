import { test } from "../test-options";
import { PageManager } from "../page-objects/pageManager";

test("submit Inline form", async ({ pageManager }) => {
  const { faker } = await import("@faker-js/faker");
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName
    .replace(/\s+/g, "")
    .toLowerCase()}${faker.number.int(1000)}@test.com`;

  await pageManager
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      process.env.ME,
      process.env.PASSWORD,
      "Option 2"
    );
  await pageManager
    .onFormLayoutsPage()
    .submitInlineForm(randomFullName, randomEmail, true);
});
