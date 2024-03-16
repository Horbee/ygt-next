import type { Locator, Page } from "@playwright/test";
import format from "date-fns/format";
import { ImageSelector } from "./image-selector";

export class CreateEventPage {
  imageSelector: ImageSelector;
  path: string;

  constructor(public readonly page: Page) {
    this.imageSelector = new ImageSelector(page);
    this.path = "http://localhost:3000/events/create";
  }

  private async selectDate(
    date: Date,
    dialogName: "Start Date" | "End Date",
    inputField: Locator
  ) {
    await inputField.click();
    const stringDate = format(date, "d MMMM yyyy");
    await this.page
      .getByRole("dialog", { name: dialogName })
      .getByRole("button", { name: stringDate, exact: true })
      .click();
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async selectStartDate(date: Date) {
    await this.selectDate(date, "Start Date", this.startDateInput);
  }

  async selectEndDate(date: Date) {
    await this.selectDate(date, "End Date", this.endDateInput);
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
