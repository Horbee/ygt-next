import { useSession } from "next-auth/react";
import Link from "next/link";

import { Badge, Card, Grid, Group, Image, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Attachment, Event } from "@prisma/client";

import { formatEventDuration } from "../utils/duration";
import { EventCardMenu } from "./EventCardMenu";

interface Props {
  event: Event & {
    coverImage: Attachment | null;
  };
}

export const EventCard = ({ event }: Props) => {
  const { data: sessionData } = useSession();
  const xsScreen = useMediaQuery("(min-width: 576px)");
  const isOwned = sessionData?.user.id === event.ownerId;

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder>
      <Card.Section>
        <Grid>
          <Grid.Col xs={3} p={0} m={0}>
            <Image
              src={event.coverImage?.url ?? "/default_event.png"}
              height={xsScreen ? 130 : 180}
              alt="Event Cover"
            />
          </Grid.Col>

          <Grid.Col span={isOwned ? 10 : 12} xs={8}>
            <Stack style={{ gap: 0 }} p="xs">
              <Group position="apart">
                <Text size="sm" color="orange">
                  {formatEventDuration(event)}
                </Text>

                <Group>
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" color="orange">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </Group>
              <Text
                component={Link}
                href={"/events/" + event.slug}
                size="lg"
                weight={500}
                sx={{
                  maxWidth: 340,
                  "&:hover": { textDecoration: "underline" },
                }}
                truncate
              >
                {event.name}
              </Text>

              <Text
                size="sm"
                color="dimmed"
                sx={{ maxWidth: 340 }}
                lineClamp={2}
              >
                {event.description}
              </Text>
            </Stack>
          </Grid.Col>

          {isOwned && (
            <Grid.Col span={1}>
              <EventCardMenu
                eventId={event.id}
                slug={event.slug}
                sx={{ alignSelf: "start" }}
                pt="sm"
              />
            </Grid.Col>
          )}
        </Grid>
      </Card.Section>
    </Card>
  );
};
