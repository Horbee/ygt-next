import getHours from "date-fns/getHours";
import getMinutes from "date-fns/getMinutes";
import set from "date-fns/set";

export const formatDateTime = (date: Date, time: string, wholeDay: boolean) => {
  const { hours, minutes } = parseTime(time, wholeDay);

  return set(date, { hours, minutes });
};

const parseTime = (time: string, wholeDay: boolean) => {
  if (wholeDay) return { hours: 12, minutes: 0 };

  const parts = time.split(":");
  return { hours: Number(parts[0]), minutes: Number(parts[1]) };
};

export const mapToDateInput = (date: Date): string => {
  const hours = getHours(date);
  const minutes = getMinutes(date);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const resetTime = (date: Date): Date => {
  return set(date, { hours: 0, minutes: 0 });
};
