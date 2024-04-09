import { Bell } from "lucide-react";

import { Button, Stack, Text } from "@mantine/core";

import { BaseLayout } from "../../components/BaseLayout";
import { useCreateSubscription } from "../../hooks/useCreateSubscription";
import { GetServerSideProps } from "next";
import { withAuthentication } from "../../utils/withAuthentication";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

export default function NotificationsPage() {
  const { triggerSubscription, subscriptionFound } = useCreateSubscription();

  return (
    <BaseLayout title="Notification Settings">
      <Stack>
        <Button
          leftSection={<Bell size={16} />}
          variant="outline"
          onClick={() => triggerSubscription({ showFeedback: true })}
        >
          Enable Push Notifications
        </Button>

        <Text c="dimmed">
          Push Notifications are {subscriptionFound ? "enabled" : "disabled"}.
        </Text>
      </Stack>
    </BaseLayout>
  );
}
