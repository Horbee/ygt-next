import format from "date-fns/format";

import { User } from "@prisma/client";
import sendgrid, { MailDataRequired } from "@sendgrid/mail";

import { env } from "../env/server.mjs";

sendgrid.setApiKey(env.SEND_GRID_KEY);

export async function sendMail(mail: MailDataRequired) {
  return sendgrid.send(mail);
}

export async function sendAvailabilityEmail(
  ownerName: string,
  users: User[],
  eventSlug: string,
  eventName: string,
  date: Date
) {
  const formattedDate = format(date, "dd-MMM-yyyy");

  const mails = users.map((u) => {
    const template = `
      <div>
        <h1>Hi ${u.name}!</h1>
        <p>${ownerName} added availability for: ${eventName}, date: ${formattedDate}. Check it out:</p>
        <a href="https://ygt-next.vercel.app/events/${eventSlug}">Jump to YGT!</a>
      </ div>
    `;

    const mail: MailDataRequired = {
      to: u.email!,
      subject: "YGT: Availability added",
      from: "thehonormaster@gmail.com",
      html: template,
    };

    return mail;
  });

  try {
    await sendgrid.send(mails);
    console.log(`Availability E-Mail sent. EventSlug: ${eventSlug}`);
  } catch (error) {
    console.error(`Unable to send availability E-Mail. EventSlug: ${eventSlug}`);
    console.error(error);
  }
}
