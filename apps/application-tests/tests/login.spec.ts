import { expect } from "@playwright/test";
import smtpTester, { type MailServer } from "smtp-tester";
import { load as cheerioLoad } from "cheerio";

import crypto from "crypto";

import { test } from "../fixtures/object-models";

test.describe("auth", () => {
  let mailServer: MailServer;

  test.beforeAll(() => {
    mailServer = smtpTester.init(4025);
  });

  test.afterAll(() => {
    mailServer.stop(() => {});
  });

  test("Can login", async ({ loginPage, userSettingsPage, page }) => {
    await loginPage.goto();

    await expect(loginPage.header).toHaveText(/sign into your account/i);

    const emailId = crypto.randomBytes(10).toString("hex") + "@tester.com";
    await loginPage.emailInput.fill(emailId);
    await loginPage.submitButton.click();

    let emailLink = null;

    try {
      const { email } = await mailServer.captureOne(emailId, {
        wait: 1000,
      });

      const $ = cheerioLoad(email.html as string);

      emailLink = $("a").attr("href");
    } catch (cause) {
      console.error(
        "No message delivered to test@example.com in 1 second.",
        cause
      );
    }

    await page.waitForURL(/verify-request/);
    await expect(page.getByRole("heading")).toHaveText(/check your email/i);

    expect(emailLink).not.toBeFalsy();

    await page.goto(emailLink!);

    await page.waitForURL(/users\/me/);
    await userSettingsPage.usernameInput.fill("Test User");
    await userSettingsPage.saveButton.click();

    await page.waitForURL(/events/);
    await expect(
      page.getByRole("heading", { name: /my event list/i })
    ).toBeVisible();
  });
});
