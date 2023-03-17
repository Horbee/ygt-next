import format from "date-fns/format";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export const useSelectedDate = () => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const selectedDate = dateParam ? new Date(dateParam) : null;

  const setSelectedDate = (date: Date | null) => {
    const params = new URLSearchParams();

    if (date) params.set("date", getFormattedDate(date));
    else params.delete("date");

    router.push({ pathname: pathname, query: params.toString() }, undefined, {
      scroll: false,
    });
  };

  return { selectedDate, setSelectedDate };
};

export function getFormattedDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
