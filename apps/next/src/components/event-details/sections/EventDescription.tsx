import { useSession } from "next-auth/react";

import { Grid, Group, Image, Paper, Spoiler, Text } from "@mantine/core";
import { Attachment, Event } from "@ygt/db";

import { formatEventDuration } from "../../../utils/duration";
import { EventCardMenu } from "../../EventCardMenu";
import { EventStatusBadge } from "../../EventStatusBadge";
import { ScrollableTagList } from "../../event-list/content/event-card/ScrollableTagList";

type Props = {
  event: Event & { coverImage: Attachment | null };
};

export const EventDescription = ({ event }: Props) => {
  const session = useSession();
  const isOwned = session.data?.user.id === event.ownerId;

  return (
    <>
      <Group position="apart">
        {/* Date */}
        <Text size="sm" c="orange">
          {formatEventDuration(event)}
        </Text>

        <EventStatusBadge event={event} />
      </Group>

      {/* Title & Actions */}
      <Grid>
        <Grid.Col span={isOwned ? 11 : 12}>
          <h3>{event?.name}</h3>
        </Grid.Col>
        <Grid.Col span={1}>
          {isOwned && (
            <EventCardMenu
              eventId={event!.id}
              slug={event!.slug}
              sx={{ alignSelf: "start" }}
              pt="sm"
            />
          )}
        </Grid.Col>
      </Grid>

      {/* Tags */}
      <ScrollableTagList tags={event.tags} />

      {/* Description */}
      <Paper shadow="xs" radius="md" p="sm" withBorder>
        <Grid>
          {event.coverImage && (
            <Grid.Col span={4} xs={3}>
              <Image
                src={event.coverImage.url}
                width={100}
                height={100}
                alt="Event Cover"
              />
            </Grid.Col>
          )}
          <Grid.Col span={event.coverImage ? 8 : 12}>
            <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
              <Text>{event.description}</Text>
            </Spoiler>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
};
