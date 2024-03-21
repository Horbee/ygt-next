import { test as base } from "@playwright/test";
import { LoginPage } from "../object-models/login-page";
import { UserSettingsPage } from "../object-models/user-settings-page";
import { CreateEventPage } from "../object-models/event/create-event-page";

interface ObjectModelFixtures {
  loginPage: LoginPage;
  userSettingsPage: UserSettingsPage;
  createEventPage: CreateEventPage;
}

export const test = base.extend<ObjectModelFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  userSettingsPage: async ({ page }, use) => use(new UserSettingsPage(page)),
  createEventPage: async ({ page }, use) => use(new CreateEventPage(page)),
});
