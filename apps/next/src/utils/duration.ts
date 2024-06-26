import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import isSameYear from "date-fns/isSameYear";
import isSameMonth from "date-fns/isSameMonth";

import type { Event } from "@ygt/db";

export function formatEventDuration(event: Event): string {
  const { fromDate, untilDate, wholeDay } = event;

  const from = new Date(fromDate);
  const until = new Date(untilDate);
  const fromTimeDate = format(from, "HH:mm");
  const untilTimeDate = format(until, "HH:mm");
  const sameDay = isSameDay(from, until);
  const sameTime = fromTimeDate && untilTimeDate ? fromTimeDate === untilTimeDate : false;

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
    if (isSameYear(from, until)) {
      if (isSameMonth(from, until)) {
        return format(from, "dd - ") + format(until, "dd.MM.yyyy");
      }

      return format(from, "dd.MM - ") + format(until, "dd.MM.yyyy");
    }
  }

  return (
    format(from, "dd.MM.yyyy ") +
    fromTimeDate +
    " - " +
    format(until, "dd.MM.yyyy ") +
    untilTimeDate
  );
}
