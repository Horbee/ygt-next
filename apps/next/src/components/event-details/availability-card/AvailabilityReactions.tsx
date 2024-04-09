import {
  Group,
  Tooltip,
  Badge,
  Flex,
  Button,
  Box,
  type MantineStyleProp,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { SmilePlus } from "lucide-react";

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
  isDisabled?: boolean;
};

export const AvailabilityReactions = ({
  groupedReactions,
  handleAddReaction,
  openEmojiSelector,
  isDisabled,
}: Props) => {
  const { data: sessionData } = useSession();

  const ownerNames = (emoji: string) =>
    groupedReactions[emoji]?.users.map((u) => u.ownerName).join(", ");

  const hoverStyles: MantineStyleProp = isDisabled
    ? {}
    : {
        "&:hover": {
          border: "1px solid #016c69",
          cursor: "pointer",
        },
      };

  return (
    <Group align="left" gap="5px">
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
              style={{
                border: "1px solid transparent",
                userSelect: "none",
                ...hoverStyles,
              }}
              py="sm"
              size="md"
              variant={userReacted ? "light" : "subtle"}
              onClick={() => {
                if (isDisabled) return;

                handleAddReaction({ native: emoji, shortcodes });
              }}
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
      <Button
        variant="subtle"
        onClick={openEmojiSelector}
        disabled={isDisabled}
        size="compact-xs"
      >
        <SmilePlus size={20} />
      </Button>
    </Group>
  );
};
