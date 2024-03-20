import { useSession } from "next-auth/react";

import { Avatar, Box, Group, Text } from "@mantine/core";

import { LogoutButton } from "./LogoutButton";

import type { GroupProps } from "@mantine/core";
export const UserLink = (props: GroupProps) => {
  const { data } = useSession();

  return (
    <Group {...props}>
      <Avatar src={data?.user.image} radius="xl" />
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
