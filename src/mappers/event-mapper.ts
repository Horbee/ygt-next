import type { EventFormValues } from "../types";
import { formatDateTime } from "../utils/format-date-time";

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
    fromDate: formatDateTime(fromDate!, wholeDay ? { hours: 12, minutes: 0 } : fromTime!),
    untilDate: formatDateTime(
      untilDate!,
      wholeDay ? { hours: 12, minutes: 0 } : untilTime!
    ),
    invitedUserIds: data.public ? [] : data.invitedUsers.map((u) => u.id),
    tags: data.tags.map((t) => t.label),
    coverImageId,
  };
}
