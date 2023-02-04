import type { EventFormValues } from "../types";

export function mapToCreateEventDto(
  data: EventFormValues,
  coverImageId: string | null = null
) {
  const {
    fromDate,
    untilDate,
    fromTime,
    untilTime,
    description,
    coverImageUrl, // don't include in the DTO
    wholeDay,
    ...rest
  } = data;

  return {
    ...rest,
    wholeDay,
    description,
    fromDate: fromDate!,
    untilDate: untilDate!,
    fromTime: !wholeDay ? fromTime : null,
    untilTime: !wholeDay ? untilTime : null,
    invitedUserIds: data.public ? [] : data.invitedUsers.map((u) => u.id),
    tags: data.tags.map((t) => t.label),
    coverImageId,
  };
}
