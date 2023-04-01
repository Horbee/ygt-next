import { FaBell } from "react-icons/fa"

import { Button, Stack, Text } from "@mantine/core"

import { BaseLayout } from "../../components/BaseLayout"
import { useAuthenticatedRedirect } from "../../hooks"
import { useCreateSubscription } from "../../hooks/useCreateSubscription"

export default function NotificationsPage() {
  useAuthenticatedRedirect("/login");

  const { triggerSubscription } = useCreateSubscription({ autoSub: false });

  return (
    <BaseLayout title="Notification Settings">
      <Stack>
        <Button leftIcon={<FaBell />} variant="white" onClick={triggerSubscription}>
          Trigger Subscription
        </Button>

        <Text c="dimmed">Push Notifications are controlled at browser level.</Text>
      </Stack>
    </BaseLayout>
  );
}
