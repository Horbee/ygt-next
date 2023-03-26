import { Page } from "@playwright/test";

export class BasePage {
  // TODO
  baseUrl = "http://localhost:3000";

  constructor(public readonly page: Page, public readonly path: string) {}

  async goto() {
    return this.page.goto(this.fullPath);
  }

  get fullPath() {
    return this.baseUrl + this.path;
  }
}
