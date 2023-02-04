import { useSession } from "next-auth/react";

import { Badge, Grid, Group, Image, Paper, Spoiler, Text } from "@mantine/core";
import { Attachment, Event } from "@prisma/client";

import { formatEventDuration } from "../../../utils/duration";
import { EventCardMenu } from "../../EventCardMenu";

type Props = {
  event: Event & { coverImage: Attachment | null };
};

export const EventDescription = ({ event }: Props) => {
  const session = useSession();
  const isOwned = session.data?.user.id === event.ownerId;

  return (
    <>
      {/* Date */}
      <Text size="sm" c="orange">
        {formatEventDuration(event)}
      </Text>

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
      <Group mb="sm" spacing="xs">
        {event.tags.map((tag) => (
          <Badge key={tag} variant="outline" color="orange">
            {tag}
          </Badge>
        ))}
      </Group>

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
