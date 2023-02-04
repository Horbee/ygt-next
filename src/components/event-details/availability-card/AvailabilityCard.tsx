import format from "date-fns/format";

import { Card, Group, Stack, Text } from "@mantine/core";

import { AvailabilityBadge } from "./AvailabilityBadge";

import type { AvailabilityDataWithOwner, AvailableTypes } from "../../../types";

export const AvailabilityCard = ({ av }: { av: AvailabilityDataWithOwner }) => {
  return (
    <Card key={av.id} shadow="sm" p="sm" radius="md" withBorder>
      <Group position="apart">
        <Text weight={500}>{av.owner.name}</Text>
        <Stack style={{ gap: 0 }} align="center">
          <AvailabilityBadge type={av.available as AvailableTypes} />
          <Text size="sm" color="dimmed">
            {getTime(
              av.fromTime ? new Date(av.fromTime) : null,
              av.untilTime ? new Date(av.untilTime) : null
            )}
          </Text>
        </Stack>
      </Group>

      <Text size="sm" color="dimmed">
        {av.comment}
      </Text>
    </Card>
  );
};

const getTime = (fromTime?: Date | null, untilTime?: Date | null): string => {
  const elements: string[] = [];

  if (fromTime) elements.push(format(fromTime, "HH:mm"));
  elements.push("-");
  if (untilTime) elements.push(format(untilTime, "HH:mm"));

  return elements.join("");
};
