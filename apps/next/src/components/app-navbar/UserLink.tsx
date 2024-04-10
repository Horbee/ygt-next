import { useSession } from "next-auth/react";

import { Box, Group, Text } from "@mantine/core";

import { LogoutButton } from "./LogoutButton";
import { UserAvatar } from "../UserAvatar";

import type { GroupProps } from "@mantine/core";
export const UserLink = (props: GroupProps) => {
  const { data } = useSession();

  return (
    <Group {...props}>
      <UserAvatar name={data?.user.name ?? ""} image={data?.user.image} />

      <Box sx={{ flex: 1 }}>
        <Text size="sm" weight={500}>
          {data?.user.name}
        </Text>
        <Text color="dimmed" size="xs">
          {data?.user.email}
        </Text>
      </Box>
      <LogoutButton />
    </Group>
  );
};
