import { useForm } from "react-hook-form";

import type { UseFormReturn } from "react-hook-form";

import type { EventDataForm, EventFormValues } from "../types";

export const useEventForm = (event?: EventDataForm): UseFormReturn<EventFormValues, any> => {
  const defaultValues: EventFormValues = {
    name: event?.name ?? "",
    slug: event?.slug ?? "",
    description: event?.description ?? null,
    public: event?.public ?? false,
    wholeDay: event?.wholeDay ?? false,
    fromDate: event?.fromDate ? new Date(event.fromDate) : null,
    fromTime: event?.fromTime ? new Date(event.fromTime) : null,
    untilDate: event?.untilDate ? new Date(event.untilDate) : null,
    untilTime: event?.untilTime ? new Date(event.untilTime) : null,
    invitedUsers: event?.invitedUsers ?? [],
    tags: event?.tags.map((t) => ({ label: t, value: t })) ?? [],
    coverImageUrl: event?.coverImage?.url ?? null,
  };

  return useForm<EventFormValues>({
    defaultValues,
  });
};

export type UseEventForm = ReturnType<typeof useEventForm>;
