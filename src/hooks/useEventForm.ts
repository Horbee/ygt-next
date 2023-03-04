import { useForm } from "react-hook-form";

import { mapToDateInput, resetTime } from "../utils/format-date-time";

import type { UseFormReturn } from "react-hook-form";

import type { EventDataForm, EventFormValues } from "../types";
export const useEventForm = (
  event?: EventDataForm
): UseFormReturn<EventFormValues, any> => {
  const defaultValues: EventFormValues = {
    name: event?.name ?? "",
    slug: event?.slug ?? "",
    description: event?.description ?? null,
    public: event?.public ?? false,
    wholeDay: event?.wholeDay ?? false,
    fromDate: event?.fromDate ? resetTime(event.fromDate) : null,
    fromTime: event?.fromDate && !event.wholeDay ? mapToDateInput(event.fromDate) : "",
    untilDate: event?.untilDate ? resetTime(event.untilDate) : null,
    untilTime: event?.untilDate && !event.wholeDay ? mapToDateInput(event.untilDate) : "",
    invitedUsers: event?.invitedUsers ?? [],
    tags: event?.tags.map((t) => ({ label: t, value: t })) ?? [],
    coverImageUrl: event?.coverImage?.url ?? null,
  };

  return useForm<EventFormValues>({
    defaultValues,
  });
};

export type UseEventForm = ReturnType<typeof useEventForm>;
