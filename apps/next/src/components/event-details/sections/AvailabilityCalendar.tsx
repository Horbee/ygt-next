import isSameDay from "date-fns/isSameDay";
import isFuture from "date-fns/isFuture";
import isPast from "date-fns/isPast";
import max from "date-fns/max";
import closestTo from "date-fns/closestTo";

import { Center, Indicator } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

import type { Event } from "@ygt/db";
import type { AvailabilityDataWithOwner } from "../../../types";

type Props = {
  event: Event;
  availabilities: AvailabilityDataWithOwner[];
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
};

export const AvailabilityCalendar = ({
  event,
  availabilities,
  selectedDate,
  setSelectedDate,
}: Props) => {
  const latestAvailability = availabilities.length
    ? max(availabilities.map((a) => a.date))
    : null;

  const getDateColor = (currentDate: Date) => {
    const data =
      availabilities.filter((a) => isSameDay(new Date(a.date), currentDate)) ?? [];

    console.log({ data });

    const notGoodCount = data.filter((d) => d.available === "notgood").length;
    const maybeCount = data.filter((d) => d.available === "maybe").length;
    const goodCount = data.filter((d) => d.available === "good").length;
    const invitedUserCount = event.invitedUserIds.length;

    if (notGoodCount > 0) {
      return "red";
    }

    if (maybeCount > 0) {
      return "orange";
    }

    if (!event.public && invitedUserCount > 0 && goodCount === invitedUserCount + 1) {
      return "green";
    } else if (data.length > 0) return "orange";
  };

  const isOngoing = isPast(event.fromDate) && isFuture(event.untilDate);

  const closestDate = closestTo(new Date(), [event.fromDate, event.untilDate]);

  return (
    <Center>
      <DatePicker
        value={selectedDate}
        defaultDate={
          selectedDate ?? latestAvailability ?? (isOngoing ? new Date() : closestDate)
        }
        onChange={setSelectedDate}
        minDate={new Date(event.fromDate)}
        maxDate={new Date(event.untilDate)}
        renderDay={(date) => {
          const color = getDateColor(date);
          const day = date.getDate();
          return (
            <Indicator size={6} color={color} offset={-5} disabled={!!!color}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
    </Center>
  );
};
