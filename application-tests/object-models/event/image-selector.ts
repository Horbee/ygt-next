import path from "path";

import type { Page } from "@playwright/test";

export class ImageSelector {
  constructor(public readonly page: Page) {}

  async open() {
    await this.page.getByTestId("image-selector").click();
  }

  async selectFile(filename: string) {
    const filePath = path.join(__dirname, "../../assets/", filename);
    await this.page.locator("input[type=file]").setInputFiles(filePath);
  }

  get uploadTab() {
    return this.page.getByRole("tab", { name: "Upload" });
  }

  get selectTab() {
    return this.page.getByRole("tab", { name: "Select" });
  }

  get uploadButton() {
    return this.page.getByRole("button", { name: "Upload" });
  }

  get selectButton() {
    return this.page.getByRole("button", { name: "Select" });
  }

  get firstImage() {
    return this.page.getByLabel("Select").locator("img").first();
  }
}
