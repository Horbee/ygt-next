import { BasePage } from "../base-page";

import type { Page } from "@playwright/test";

export class UserSettingsPage extends BasePage {
  constructor(public readonly page: Page) {
    super(page, "/users/me");
  }

  get usernameInput() {
    return this.page.getByRole("textbox", { name: /username/i });
  }

  get saveButton() {
    return this.page.getByRole("button", { name: /save/i });
  }
}
