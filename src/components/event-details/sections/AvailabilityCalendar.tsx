import isSameDay from "date-fns/isSameDay";

import { Center, createStyles } from "@mantine/core";
import { Calendar } from "@mantine/dates";

import type { Event } from "@prisma/client";
import type { AvailabilityDataWithOwner } from "../../../types";

type Props = {
  event: Event;
  availabilities: AvailabilityDataWithOwner[];
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
};

const useStyles = createStyles((theme) => ({
  weekend: {
    color: `${theme.colors.indigo[9]} !important`,
  },
}));

export const AvailabilityCalendar = ({
  event,
  availabilities,
  selectedDate,
  setSelectedDate,
}: Props) => {
  const { classes, cx } = useStyles();

  const getDateColor = (currentDate: Date) => {
    const data =
      availabilities.filter((a) => isSameDay(new Date(a.date), currentDate)) ??
      [];
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

  return (
    <Center>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        minDate={new Date(event.fromDate)}
        maxDate={new Date(event.untilDate)}
        dayStyle={(date) => ({
          backgroundColor: getDateColor(date),
          borderRadius: "50%",
          // border: "1px solid #fff",
        })}
        dayClassName={(date, modifiers) =>
          cx({ [classes.weekend]: modifiers.weekend })
        }
      />
    </Center>
  );
};
