import { expect } from "@playwright/test";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import { faker } from "@faker-js/faker";

import { withLoggedInUserTest as test } from "../../fixtures";
import {
  createTestUserByName,
  deleteTestUserByEmail,
} from "../../helpers/user";

test("Validation: Can't create event with invalid form", async ({
  loginWorkflow,
  createEventPage,
}) => {
  await createEventPage.goto();

  // Check validation errors
  await createEventPage.createButton.click();

  await expect(
    createEventPage.page.getByText("Event Name is required")
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText("Start Date is required")
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText("End Date is required")
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText(
      'Start Time is required if "Whole Day" is not checked'
    )
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText(
      'End Time is required if "Whole Day" is not checked'
    )
  ).toBeVisible();

  expect(createEventPage.page.url()).toBe(createEventPage.fullPath);

  await createEventPage.wholeDaySwitch.click();

  await createEventPage.createButton.click();

  await expect(
    createEventPage.page.getByText("Event Name is required")
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText("Start Date is required")
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText("End Date is required")
  ).toBeVisible();
  await expect(
    createEventPage.page.getByText(
      'Start Time is required if "Whole Day" is not checked'
    )
  ).not.toBeVisible();
  await expect(
    createEventPage.page.getByText(
      'End Time is required if "Whole Day" is not checked'
    )
  ).not.toBeVisible();

  expect(createEventPage.page.url()).toBe(createEventPage.fullPath);
});

test("Can create public event", async ({
  page,
  loginWorkflow,
  createEventPage,
}) => {
  const eventData = {
    title: faker.lorem.words(2),
    description: faker.lorem.paragraph(2),
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    startTime: "12:30",
    endTime: "18:00",
    tag: `#${faker.lorem.word(4)}`,
  };

  await test.step("Can upload attachment", async () => {
    await createEventPage.goto();

    await createEventPage.imageSelector.open();
    await createEventPage.imageSelector.uploadTab.click();
    await createEventPage.imageSelector.selectFile("test-img.jpg");
    await createEventPage.imageSelector.uploadButton.click();

    await createEventPage.imageSelector.selectTab.click();
    await createEventPage.imageSelector.firstImage.click();
    await createEventPage.imageSelector.selectButton.click();

    await expect(createEventPage.coverImage).toBeVisible();
  });

  await test.step("Can submit rest of the form", async () => {
    await createEventPage.eventNameInput.fill(eventData.title);
    await createEventPage.descriptionInput.fill(eventData.description);

    await createEventPage.publishSwitch.click();

    await createEventPage.selectStartDate(eventData.startDate);
    await createEventPage.selectEndDate(eventData.endDate);

    await createEventPage.startTimeInput.fill(eventData.startTime);
    await createEventPage.endTimeInput.fill(eventData.endTime);

    await createEventPage.isPublicSwitch.click();

    await createEventPage.addTagsInput.click();
    await createEventPage.addTagsInput.fill(eventData.tag);
    await createEventPage.addTagsInput.press("Tab");

    await createEventPage.createButton.click({ position: { x: 10, y: 10 } });

    await expect(page.getByText(eventData.title)).toBeVisible();
  });

  await test.step("Can't create event when slug is already taken", async () => {
    await createEventPage.goto();
    await createEventPage.eventNameInput.fill(eventData.title);

    await createEventPage.createButton.click();

    await expect(
      createEventPage.page.getByText("This slug is already taken")
    ).toBeVisible();

    expect(createEventPage.page.url()).toBe(createEventPage.fullPath);
  });

  await test.step("Can create private event with invited users", async () => {
    await createEventPage.goto();

    const newEventData = {
      title: faker.lorem.words(2),
      description: faker.lorem.paragraph(2),
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      invitedUser: await createTestUserByName(faker.person.firstName()),
    };

    await createEventPage.eventNameInput.fill(newEventData.title);
    await createEventPage.descriptionInput.fill(newEventData.description);

    await createEventPage.publishSwitch.click();

    await createEventPage.selectStartDate(newEventData.startDate);
    await createEventPage.selectEndDate(newEventData.endDate);

    await createEventPage.wholeDaySwitch.click();

    await createEventPage.invitedUsersInput.click({ force: true });
    await createEventPage.invitedUsersInput.fill(
      newEventData.invitedUser.name!
    );
    await createEventPage.invitedUsersInput.press("Tab");

    await createEventPage.createButton.click();

    await expect(page.getByText(newEventData.title)).toBeVisible();

    await deleteTestUserByEmail(newEventData.invitedUser.email!);
  });
});
