import smtpTester from "smtp-tester";
import path from "path";
import fs from "fs";

import { test as base } from "./object-models";
import { LoginPage } from "../object-models/login-page";
import { UserSettingsPage } from "../object-models/user-settings-page";
import { deleteTestUserByEmail } from "../helpers/user";
import { getRandomString } from "../helpers/random-string";

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
      const page = await browser.newPage({ storageState: undefined });
      const loginPage = new LoginPage(page);
      const userSettingsPage = new UserSettingsPage(page);

      const mailServer = smtpTester.init(4025);
      const emailId = getRandomString(10) + "@tester.com";

      await loginPage.loginNewUser(emailId);
      const url = await loginPage.extractLoginEmailUrl(mailServer, emailId);

      await page.goto(url!);

      await page.waitForURL(/users\/me/);
      await userSettingsPage.usernameInput.fill("Test User");
      await userSettingsPage.saveButton.click();

      await page.waitForURL(/events/);
      // End of authentication steps.

      await page.context().storageState({ path: fileName });
      await page.close();

      await use(fileName);

      await deleteTestUserByEmail(emailId);

      mailServer.stop(() => {});
    },
    { scope: "worker" },
  ],
});
