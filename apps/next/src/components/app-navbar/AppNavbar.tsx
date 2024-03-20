import { Box, Divider, Drawer, Stack } from "@mantine/core";

import { MainLink } from "./MainLink";
import { NavHeader } from "./NavHeader";
import { UserLink } from "./UserLink";
import { Bell, CalendarPlus, Info, List, UserCog } from "lucide-react";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const AppNavbar = ({ opened, onClose }: Props) => {
  return (
    <Drawer opened={opened} onClose={onClose} withCloseButton={false} padding="none">
      <Stack p="sm" h="100vh" spacing="xs">
        <NavHeader onClose={onClose} />

        <Box style={{ flexGrow: 1 }}>
          <Divider my="sm" />
          <MainLink
            label="Event List"
            href="/events"
            color="blue"
            icon={<List size={18} />}
            onClose={onClose}
          />
          <MainLink
            label="Create Event"
            href="/events/create"
            color="orange"
            icon={<CalendarPlus size={18} />}
            onClose={onClose}
          />
          <MainLink
            label="User Settings"
            href="/users/me"
            color="indigo"
            icon={<UserCog size={18} />}
            onClose={onClose}
          />
          <MainLink
            label="Notification Settings"
            href="/notifications"
            color="grape"
            icon={<Bell size={18} />}
            onClose={onClose}
          />
          <MainLink
            label="About"
            href="/about"
            color="green"
            icon={<Info size={18} />}
            onClose={onClose}
          />
        </Box>

        <Box>
          <Divider my="sm" />
          <UserLink />
        </Box>
      </Stack>
    </Drawer>
  );
};
