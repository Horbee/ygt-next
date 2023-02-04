import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";

import type { Event } from "@prisma/client";

export function formatEventDuration(event: Event): string {
  const { fromDate, untilDate, fromTime, untilTime, wholeDay } = event;

  const from = new Date(fromDate);
  const until = new Date(untilDate);
  const fromTimeDate = fromTime ? format(new Date(fromTime), "HH:mm") : "";
  const untilTimeDate = untilTime ? format(new Date(untilTime), "HH:mm") : "";
  const sameDay = isSameDay(from, until);
  const sameTime =
    fromTimeDate && untilTimeDate ? fromTimeDate === untilTimeDate : false;

  if (sameDay && wholeDay) {
    return format(from, "EEE d. LLL");
  }

  if (sameDay && !wholeDay) {
    if (sameTime) {
      return format(from, "EEE d. LLL ") + fromTimeDate;
    } else {
      return format(from, "EEE d. LLL ") + fromTimeDate + " - " + untilTimeDate;
    }
  }

  if (!sameDay && wholeDay) {
    return format(from, "dd.MM.yyyy - ") + format(until, "dd.MM.yyyy");
  }

  return (
    format(from, "dd.MM.yyyy ") +
    fromTimeDate +
    " - " +
    format(until, "dd.MM.yyyy ") +
    untilTimeDate
  );
}
