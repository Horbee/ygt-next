import type { Page } from "@playwright/test";

export class UserSettingsPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto("http://localhost:3000/users/me");
  }

  get usernameInput() {
    return this.page.getByRole("textbox", { name: /username/i });
  }

  get saveButton() {
    return this.page.getByRole("button", { name: /save/i });
  }
}
