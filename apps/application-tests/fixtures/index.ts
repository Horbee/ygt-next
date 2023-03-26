import smtpTester from "smtp-tester";
import path from "path";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { test as base } from "./object-models";
import { LoginPage } from "../object-models/pages/login-page";
import { UserSettingsPage } from "../object-models/pages/user-settings-page";
import { deleteTestUserByEmail } from "../helpers/user";

interface LoggedInUserFixture {
  loginWorkflow: string;
}

export const withLoggedInUserTest = base.extend<{}, LoggedInUserFixture>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ loginWorkflow }, use) => use(loginWorkflow),

  loginWorkflow: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = withLoggedInUserTest.info().parallelIndex;
      const fileName = path.resolve(
        withLoggedInUserTest.info().project.outputDir,
        `.auth/${id}.json`
      );

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      // Login steps
      const page = await browser.newPage({ storageState: undefined });
      const loginPage = new LoginPage(page);

      const mailServer = smtpTester.init(4025);
      const emailId = faker.internet.email().toLowerCase(); //SMTP Tester won't find the recipient if casing is not lower

      await loginPage.loginNewUser(emailId);

      const url = await loginPage.extractLoginEmailUrl(mailServer, emailId);

      mailServer.stop(() => {});
      await page.close();

      // New Page
      const newPage = await browser.newPage({ storageState: undefined });
      await newPage.goto(url!);

      await newPage.waitForURL(/users\/me/);
      const userSettingsPage = new UserSettingsPage(newPage);
      await userSettingsPage.usernameInput.fill(faker.person.fullName());
      await userSettingsPage.saveButton.click();

      await newPage.waitForURL(/events/);
      // End of authentication steps.

      await newPage.context().storageState({ path: fileName });
      await newPage.close();

      await use(fileName);

      await deleteTestUserByEmail(emailId);
    },
    { scope: "worker" },
  ],
});
