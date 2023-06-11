import { FaBell } from "react-icons/fa";

import { Button, Stack, Text } from "@mantine/core";

import { BaseLayout } from "../../components/BaseLayout";
import { useCreateSubscription } from "../../hooks/useCreateSubscription";
import { GetServerSideProps } from "next";
import { withAuthentication } from "../../utils/withAuthentication";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

export default function NotificationsPage() {
  const { triggerSubscription } = useCreateSubscription({ autoSub: false });

  return (
    <BaseLayout title="Notification Settings">
      <Stack>
        <Button leftIcon={<FaBell />} variant="outline" onClick={triggerSubscription}>
          Trigger Subscription
        </Button>

        <Text c="dimmed">Push Notifications are controlled at browser level.</Text>
      </Stack>
    </BaseLayout>
  );
}
