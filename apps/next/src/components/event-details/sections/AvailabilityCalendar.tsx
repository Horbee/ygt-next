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

    if (data.some((d) => d.available === "notgood")) {
      return "red";
    }

    const goodCount = data.filter((d) => d.available === "good").length;

    if (data.some((d) => d.available === "maybe") || goodCount === 1) {
      return "orange";
    }

    if (goodCount > 1) {
      return "green";
    }
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
