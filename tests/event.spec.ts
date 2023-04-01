import fs from "fs";

import { chromium, expect, test } from "@playwright/test";

// test("has title", async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();

//   const cookies = fs.readFileSync("cookies.json", "utf8");

//   const deserializedCookies = JSON.parse(cookies);
//   await context.addCookies(deserializedCookies);

//   const page = await context.newPage();

//   await page.goto("http://localhost:3000/events");

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/My Event List/);
// });

test.use({
  storageState: "auth.json",
});

test("Can load event list page", async ({ page }) => {
  await page.goto("http://localhost:3000/events");

  await expect(page).toHaveTitle(/My Event List/);
});

test("Can create event", async ({ page }) => {
  await page.goto("http://localhost:3000/events/create");

  await page.getByRole("textbox", { name: /event name/i }).fill("test event");
  await page.getByRole("textbox", { name: /description/i }).fill("some description");
  await page.getByText(/whole day/i).click();

  await page.getByRole("button", { name: /start date/i }).click();
  await page.getByRole("button", { name: "30 March 2023", exact: true }).click();

  await page.getByRole("button", { name: /end date/i }).click();
  await page.getByRole("button", { name: "31 March 2023", exact: true }).click();

  await page.getByText(/is public/i).click();

  await page.getByRole("button", { name: /create/i }).click();

  await expect(page.getByText(/test event/i)).toBeVisible();
});

test("Can upload attachment", async ({ page }) => {
  await page.goto("http://localhost:3000/events/create");

  await page.getByTestId("image-selector").click();

  await page.getByRole("tab", { name: "Upload" }).click();

  await page.locator("input[type=file]").setInputFiles("tests/test-img.jpg");

  await page.getByRole("button", { name: "Upload" }).click();

  await page.getByRole("tabpanel", { name: "Select" }).getByRole("img").first().click();
  await page.getByRole("button", { name: "Select" }).click();

  await expect(page.getByTestId("background-img")).toBeVisible();
});
