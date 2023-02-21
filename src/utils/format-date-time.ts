import getHours from "date-fns/getHours";
import getMinutes from "date-fns/getMinutes";
import isDate from "date-fns/isDate";
import set from "date-fns/set";

export const formatDateTime = (
  date: Date,
  time: Date | { hours: number; minutes: number }
) => {
  const isdate = isDateGuard(time);

  return set(date, {
    hours: isdate ? getHours(time) : time.hours,
    minutes: isdate ? getMinutes(time) : time.minutes,
  });
};

const isDateGuard = (time: Date | { hours: number; minutes: number }): time is Date => {
  return isDate(time);
};
