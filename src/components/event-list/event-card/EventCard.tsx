import isPast from "date-fns/isPast";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Card, Grid, Group, Image, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Attachment, Event } from "@prisma/client";

import { formatEventDuration } from "../../../utils/duration";
import { EventCardMenu } from "../../EventCardMenu";
import { ScrollableTagList } from "./ScrollableTagList";

interface Props {
  event: Event & {
    coverImage: Attachment | null;
  };
}

export const EventCard = ({ event }: Props) => {
  const { data: sessionData } = useSession();
  const xsScreen = useMediaQuery("(max-width: 576px)");
  const isOwned = sessionData?.user.id === event.ownerId;
  const isPastEvent = isPast(event.untilDate);

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder>
      <Card.Section>
        <Grid>
          <Grid.Col xs={3} p={0} m={0}>
            <Image
              src={event.coverImage?.url ?? "/default_event.png"}
              height={xsScreen ? 180 : 135}
              alt="Event Cover"
              style={{ filter: isPastEvent ? "grayscale(1)" : undefined }}
            />
          </Grid.Col>

          <Grid.Col span={12} xs={9}>
            {/* Second Col */}
            <Stack style={{ gap: 0 }} p="xs">
              {/* First Row Flex Container */}
              <Group position="apart" noWrap style={{ overflow: "hidden" }}>
                <Text size="sm" color="orange" style={{ overflow: "hidden" }}>
                  {formatEventDuration(event)}
                </Text>

                {/* <Group style={{}}> */}
                {!xsScreen && <ScrollableTagList padLeft tags={event.tags} style={{ flex: 1 }} />}

                {isOwned && <EventCardMenu eventId={event.id} slug={event.slug} />}
                {/* </Group> */}
              </Group>

              {xsScreen && <ScrollableTagList tags={event.tags} w="100%" mt="xs" />}

              {/* Second Row: Title + Description */}
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

              <Text size="sm" color="dimmed" lineClamp={2}>
                {event.description}
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};
