import isPast from "date-fns/isPast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { Badge, Card, Group, Stack, Text } from "@mantine/core";

import { formatEventDuration } from "../../../../utils/duration";
import { EventCardMenu } from "../../../EventCardMenu";

import type { Attachment, Event } from "@ygt/db";
interface Props {
  event: Event & {
    coverImage: Attachment | null;
  };
}

export const EventCard = ({ event }: Props) => {
  const { data: sessionData } = useSession();
  const isOwned = sessionData?.user.id === event.ownerId;
  const isPastEvent = isPast(event.untilDate);

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder>
      <Group align="flex-start" pos="relative">
        {isOwned && (
          <EventCardMenu
            pos="absolute"
            top={0}
            right={0}
            eventId={event.id}
            slug={event.slug}
          />
        )}

        <Image
          src={event.coverImage?.url ?? "/default_event1x1.png"}
          width={80}
          height={80}
          alt="Event Cover"
          style={{
            filter: isPastEvent ? "grayscale(1)" : undefined,
          }}
        />

        <Stack spacing="0">
          <Text size="sm" color="orange">
            {formatEventDuration(event)}
          </Text>

          {!event.published && (
            <Badge variant="outline" color="red">
              Unpublished
            </Badge>
          )}

          <Text
            component={Link}
            href={"/events/" + event.slug}
            size="lg"
            weight={500}
            sx={{ "&:hover": { textDecoration: "underline" } }}
            truncate
          >
            {event.name}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};
