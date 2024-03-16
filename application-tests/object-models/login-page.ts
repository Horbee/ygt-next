import { load as cheerioLoad } from "cheerio";

import type { Page } from "@playwright/test";
import type { MailServer } from "smtp-tester";

export class LoginPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto("http://localhost:3000/login");
  }

  async loginNewUser(emailId: string) {
    await this.goto();
    await this.emailInput.fill(emailId);
    await this.submitButton.click();
  }

  async extractLoginEmailUrl(mailServer: MailServer, emailId: string) {
    try {
      const { email } = await mailServer.captureOne(emailId, {
        wait: 1000,
      });

      const $ = cheerioLoad(email.html as string);

      const emailLink = $("a").attr("href");
      return emailLink;
    } catch (cause) {
      console.error("No message delivered to test@example.com in 1 second.", cause);
    }
  }

  get header() {
    return this.page.getByRole("heading");
  }

  get verifyEmailHeader() {
    return this.page.getByRole("heading");
  }

  get emailInput() {
    return this.page.getByRole("textbox", { name: /email/i });
  }

  get submitButton() {
    return this.page.getByRole("button", { name: /send a magic link/i });
  }
}
