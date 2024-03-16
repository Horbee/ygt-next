import type { Locator, Page } from "@playwright/test";
import format from "date-fns/format";

export class CreateEventPage {
  constructor(public readonly page: Page) {}

  private async selectDate(date: Date, inputField: Locator) {
    await inputField.click();
    const stringDate = format(date, "d MMMM yyyy");
    await this.page.getByRole("button", { name: stringDate, exact: true }).click();
  }

  async goto() {
    await this.page.goto("http://localhost:3000/events/create");
  }

  async selectStartDate(date: Date) {
    await this.selectDate(date, this.startDateInput);
  }

  async selectEndDate(date: Date) {
    await this.selectDate(date, this.endDateInput);
  }

  get eventNameInput() {
    return this.page.getByRole("textbox", { name: /event name/i });
  }

  get descriptionInput() {
    return this.page.getByRole("textbox", { name: /description/i });
  }

  get publishSwitch() {
    return this.page.getByText(/publish/i);
  }

  get wholeDaySwitch() {
    return this.page.getByText(/whole day/i);
  }

  get isPublicSwitch() {
    return this.page.getByText(/is public/i);
  }

  get startDateInput() {
    return this.page.getByTestId("start-date-input");
  }

  get endDateInput() {
    return this.page.getByTestId("end-date-input");
  }

  get startTimeInput() {
    return this.page.getByRole("time", { name: /start time/i });
  }

  get endTimeInput() {
    return this.page.getByRole("time", { name: /end time/i });
  }

  get invitedUsersInput() {
    return this.page.getByRole("combobox", { name: /invited users/i });
  }

  get addTagsInput() {
    return this.page.getByRole("combobox", { name: /tags/i });
  }

  get createButton() {
    return this.page.getByRole("button", { name: /create/i });
  }
}
