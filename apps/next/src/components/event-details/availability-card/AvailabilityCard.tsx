import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { useMemo } from "react";
import { Box, Card, Group, Stack, Text } from "@mantine/core";
import { Clock } from "lucide-react";

import { AvailabilityBadge } from "./AvailabilityBadge";
import { AvailabilityReactions, type GroupedReactions } from "./AvailabilityReactions";
import { useEmojiSelectorModal } from "../../../context/EmojiSelectorModalProvider";

import type { AvailabilityDataWithOwner } from "../../../types";

export const AvailabilityCard = ({
  av,
  disableReactions,
}: {
  av: AvailabilityDataWithOwner;
  disableReactions?: boolean;
}) => {
  const { openModal, handleAddReaction } = useEmojiSelectorModal();

  const groupedReactions = useMemo(() => {
    const result = av.reactions.reduce((group, reaction) => {
      if (!group[reaction.emoji]) {
        // If not, initialize it
        group[reaction.emoji] = {
          count: 0,
          shortcodes: reaction.shortcodes,
          users: [],
        };
      }

      // Add the user to the emoji's users array and increment the count
      group[reaction.emoji]!.users.push({
        ownerId: reaction.ownerId,
        ownerName: reaction.ownerName,
      });
      group[reaction.emoji]!.count++;

      return group;
    }, {} as GroupedReactions);

    return result;
  }, [av.reactions]);

  return (
    <>
      <Card key={av.id} shadow="sm" p="sm" radius="md" pos="relative" withBorder>
        <Group justify="space-between">
          <Box>
            <Text fw={500}>{av.owner.name}</Text>
            <Text size="sm" c="dimmed">
              <Group gap="xs">
                <Clock size={14} />
                {formatDistanceToNow(av.updatedAt)} ago
              </Group>
            </Text>
          </Box>
          <Stack style={{ gap: 0 }} align="center">
            <AvailabilityBadge type={av.available} />
            <Text size="sm" color="dimmed">
              {getTime(
                av.fromTime ? new Date(av.fromTime) : null,
                av.untilTime ? new Date(av.untilTime) : null
              )}
            </Text>
          </Stack>
        </Group>

        <Text size="sm" color="dimmed" mt="sm" mb="lg">
          {av.comment}
        </Text>

        <AvailabilityReactions
          groupedReactions={groupedReactions}
          handleAddReaction={handleAddReaction(av.id)}
          openEmojiSelector={() => openModal(av.id)}
          isDisabled={disableReactions}
        />
      </Card>
    </>
  );
};

const getTime = (fromTime?: Date | null, untilTime?: Date | null): string => {
  const elements: string[] = [];

  if (fromTime) elements.push(format(fromTime, "HH:mm"));
  elements.push("-");
  if (untilTime) elements.push(format(untilTime, "HH:mm"));

  return elements.join("");
};
