import { Group, Tooltip, Badge, Flex, Button, Box } from "@mantine/core";
import { MdOutlineAddReaction } from "react-icons/md";
import { useSession } from "next-auth/react";

export type GroupedReactions = {
  [emoji: string]: {
    count: number;
    shortcodes: string;
    users: {
      ownerId: string;
      ownerName: string;
    }[];
  };
};

type Props = {
  groupedReactions: GroupedReactions;
  handleAddReaction: (emoji: { native: string; shortcodes: string }) => Promise<void>;
  openEmojiSelector: () => void;
};

export const AvailabilityReactions = ({
  groupedReactions,
  handleAddReaction,
  openEmojiSelector,
}: Props) => {
  const { data: sessionData } = useSession();

  const ownerNames = (emoji: string) =>
    groupedReactions[emoji]?.users.map((u) => u.ownerName).join(", ");

  return (
    <Group position="left" spacing="5px">
      {Object.keys(groupedReactions).map((emoji) => {
        const { shortcodes, users, count } = groupedReactions[emoji]!;
        const userReacted = users.find((u) => u.ownerId === sessionData?.user.id);

        return (
          <Tooltip
            key={emoji}
            color="dark"
            label={ownerNames(emoji)}
            events={{ hover: true, focus: true, touch: true }}
            withArrow
          >
            <Badge
              key={emoji}
              onContextMenu={(e) => e.preventDefault()}
              sx={{
                border: "1px solid transparent",
                userSelect: "none",
                "&:hover": {
                  border: "1px solid #016c69",
                  cursor: "pointer",
                },
              }}
              py="sm"
              size="md"
              variant={userReacted ? "light" : "subtle"}
              onClick={() => handleAddReaction({ native: emoji, shortcodes })}
            >
              <Flex gap="5px">
                <Box component="span" fz="1.2rem">
                  {emoji}
                </Box>
                <Box component="span" fz=".9rem">
                  {count}
                </Box>
              </Flex>
            </Badge>
          </Tooltip>
        );
      })}
      <Button variant="subtle" onClick={openEmojiSelector} compact>
        <MdOutlineAddReaction size={20} />
      </Button>
    </Group>
  );
};
