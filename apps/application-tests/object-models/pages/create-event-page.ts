import format from "date-fns/format";
import { ImageSelector } from "../components/image-selector";
import { BasePage } from "../base-page";

import type { Locator, Page } from "@playwright/test";

export class CreateEventPage extends BasePage {
  imageSelector: ImageSelector;

  constructor(public readonly page: Page) {
    super(page, "/events/create");
    this.imageSelector = new ImageSelector(page);
  }

  private async selectDate(
    date: Date,
    wrapperId: "start-date-wrapper" | "end-date-wrapper",
    inputField: Locator
  ) {
    await inputField.click();
    const stringDate = format(date, "d MMMM yyyy");
    await this.page
      .getByTestId(wrapperId)
      .getByRole("button", { name: stringDate, exact: true })
      .click();
  }

  async selectStartDate(date: Date) {
    await this.selectDate(date, "start-date-wrapper", this.startDateInput);
  }

  async selectEndDate(date: Date) {
    await this.selectDate(date, "end-date-wrapper", this.endDateInput);
  }

  get slugValidationError() {
    return this.page.getByText("This slug is already taken");
  }

  get eventNameInput() {
    return this.page.getByRole("textbox", { name: /event name/i });
  }

  get descriptionInput() {
    return this.page.getByRole("textbox", { name: /description/i });
  }

  get publishSwitch() {
    return this.page.getByText("Publish", { exact: true });
  }

  get wholeDaySwitch() {
    return this.page.getByText("Whole Day", { exact: true });
  }

  get isPublicSwitch() {
    return this.page.getByText("Is public", { exact: true });
  }

  get startDateInput() {
    return this.page.getByTestId("start-date-input");
  }

  get endDateInput() {
    return this.page.getByTestId("end-date-input");
  }

  get startTimeInput() {
    return this.page.getByLabel(/start time/i);
  }

  get endTimeInput() {
    return this.page.getByLabel(/end time/i);
  }

  get invitedUsersInput() {
    return this.page.locator("input[id='invited-users-input']");
  }

  get addTagsInput() {
    return this.page.locator("input[id='tags-input']");
  }

  get createButton() {
    return this.page.getByRole("button", { name: /create/i });
  }

  get coverImage() {
    return this.page.getByTestId("background-img");
  }
}
