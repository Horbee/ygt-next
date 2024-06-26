import format from "date-fns/format";

import { useMemo } from "react";
import { Card, Group, Stack, Text } from "@mantine/core";

import { AvailabilityBadge } from "./AvailabilityBadge";
import { AvailabilityReactions, type GroupedReactions } from "./AvailabilityReactions";
import { useEmojiSelectorModal } from "../../../context/EmojiSelectorModalProvider";
import { UserAvatar } from "../../UserAvatar";

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
        <Group position="apart" align="flex-start">
          <Group spacing="xs">
            <UserAvatar name={av.owner.name ?? ""} image={av.owner.image} size="sm" />
            <Text weight={500}>{av.owner.name}</Text>
          </Group>
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

        <Text size="sm" color="dimmed" mt="xs" mb={{ base: "sm", md: "md" }}>
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
