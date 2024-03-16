import { expect } from "@playwright/test";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";

import { withLoggedInUserTest as test } from "../fixtures";

test("it loads", async ({ page, loginWorkflow }) => {
  expect(page.url()).toContain("events");
});

test.only("Can create event", async ({ page, loginWorkflow, createEventPage }) => {
  await createEventPage.goto();

  await createEventPage.eventNameInput.fill("test event");
  await createEventPage.descriptionInput.fill("some description");

  await createEventPage.selectStartDate(startOfMonth(new Date()));
  await createEventPage.selectEndDate(endOfMonth(new Date()));

  await page.pause();

  await createEventPage.startTimeInput.fill("1230");
  await createEventPage.endTimeInput.fill("1800");

  await createEventPage.isPublicSwitch.click();

  await createEventPage.createButton.click();

  await expect(page.getByText(/test event/i)).toBeVisible();
});

test.skip("Can upload attachment", async ({ page }) => {
  await page.goto("http://localhost:3000/events/create");

  await page.getByTestId("image-selector").click();

  await page.getByRole("tab", { name: "Upload" }).click();

  await page.locator("input[type=file]").setInputFiles("tests/test-img.jpg");

  await page.getByRole("button", { name: "Upload" }).click();

  await page.getByRole("tabpanel", { name: "Select" }).getByRole("img").first().click();
  await page.getByRole("button", { name: "Select" }).click();

  await expect(page.getByTestId("background-img")).toBeVisible();
});
