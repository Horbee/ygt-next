import isSameDay from "date-fns/isSameDay";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { Avatar, Text, Group, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserAvatar } from "../UserAvatar";

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
  const [notAnsweredUserModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);

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

  const notAnsweredPlusCount = notAnswered.length - 3;

  return (
    <div>
      <Modal
        opened={notAnsweredUserModalOpen}
        onClose={closeModal}
        title={`User List: Not answered (${notAnswered.length})`}
      >
        <Stack>
          {notAnswered.map((user) => (
            <Group>
              <UserAvatar name={user.name ?? ""} image={user.image} />

              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {user.name}
                </Text>

                <Text color="dimmed" size="xs">
                  {user.email}
                </Text>
              </div>
            </Group>
          ))}
        </Stack>
      </Modal>

      {notAnswered.length > 0 && (
        <Group>
          <h4>Not answered ({notAnswered.length}):</h4>

          <Avatar.Group
            spacing="sm"
            style={{ cursor: "pointer" }}
            onClick={() => openModal()}
          >
            {notAnswered.slice(0, 3).map((user) => (
              <UserAvatar name={user.name ?? ""} image={user.image} />
            ))}
            {notAnsweredPlusCount > 0 && (
              <Avatar radius="xl">+{notAnsweredPlusCount}</Avatar>
            )}
          </Avatar.Group>
        </Group>
      )}
    </div>
  );
};
