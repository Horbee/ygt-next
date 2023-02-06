import { Text } from "@mantine/core";
import { Attachment, Event } from "@prisma/client";

import { EventCard } from "../EventCard";

interface Props {
  events: (Event & {
    coverImage: Attachment | null;
  })[];
}

export const EventCardList = ({ events }: Props) => {
  if (events.length === 0) {
    return <Text>No events found...</Text>;
  }

  return (
    <>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </>
  );
};
