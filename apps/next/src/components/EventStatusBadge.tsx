import { Badge } from "@mantine/core";

import type { Event } from "@ygt/db";

export function EventStatusBadge({ event }: { event: Event }) {
  if (!event.published) {
    return (
      <Badge variant="outline" color="red">
        Unpublished
      </Badge>
    );
  }

  if (event.public) {
    return (
      <Badge variant="outline" color="green">
        Public
      </Badge>
    );
  }

  return null;
}
