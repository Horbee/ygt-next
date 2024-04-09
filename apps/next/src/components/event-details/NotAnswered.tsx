import isSameDay from "date-fns/isSameDay";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { Avatar, Badge, Flex, ScrollArea, useMantineTheme } from "@mantine/core";

import type { AvailabilityDataWithOwner } from "../../types";
import type { User } from "@ygt/db";

interface Props {
  selectedDate: Date;
  availabilities: AvailabilityDataWithOwner[];
  eventOwner: User;
  invitedUsers: User[];
}

export const NotAnswered = ({
  selectedDate,
  availabilities,
  eventOwner,
  invitedUsers,
}: Props) => {
  const { colorScheme } = useMantineTheme();
  const session = useSession();
  const userId = session.data?.user.id;

  const filteredAvailabilities = useMemo(() => {
    return availabilities.filter((a) => isSameDay(new Date(a.date), selectedDate));
  }, [availabilities, selectedDate, userId]);

  const notAnswered = useMemo(() => {
    return [eventOwner, ...invitedUsers].filter(
      (user) => !filteredAvailabilities.some((av) => av.ownerId === user.id)
    );
  }, [filteredAvailabilities, invitedUsers]);

  return (
    <div>
      {notAnswered.length > 0 && (
        <>
          <h4>Not answered ({notAnswered.length}):</h4>

          <ScrollArea
            style={{
              height: "35px",
              cursor: "grab",
              overflow: "auto",
            }}
            offsetScrollbars
            scrollbarSize={5}
          >
            <Flex gap="xs">
              {notAnswered.map((user) => (
                <Badge
                  key={user.id}
                  size="lg"
                  color={colorScheme === "dark" ? "blue" : "dark"}
                  radius="xl"
                  leftSection={
                    <Avatar
                      alt="Avatar for user"
                      size={24}
                      mr={5}
                      radius="lg"
                      src={user.image}
                    >
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  }
                >
                  {user.name ?? user.email}
                </Badge>
              ))}
            </Flex>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
