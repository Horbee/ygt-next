import { motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Alert, Group, Text } from "@mantine/core";
import { AlertTriangle } from "lucide-react";

import { BaseLayout } from "../../../components/BaseLayout";
import {
  AvailabilityCalendar,
  AvailabilityList,
  AvailabilityModal,
  EventDescription,
  OwnAvailability,
} from "../../../components/event-details";
import { AvailabilityModalProvider } from "../../../context";
import { useSelectedDate } from "../../../hooks/useSelectedDate";
import { AvailabilityDataWithOwner } from "../../../types";
import { api } from "../../../utils/api";
import { withAuthentication } from "../../../utils/withAuthentication";
import { EmojiSelectorModalProvider } from "../../../context/EmojiSelectorModalProvider";
import { EmojiSelectorModal } from "../../../components/event-details/availability-card/EmojiSelectorModal";
import { UnpublishedEventWarning } from "../../../components/UnpublishedEventWarning";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

const EventDetailsPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const { selectedDate, setSelectedDate } = useSelectedDate();

  const getEvent = api.event.getEventBySlug.useQuery(
    { slug, withAvailabilities: true },
    { enabled: !!slug }
  );

  const event = getEvent.data;

  if (!event) {
    return (
      <BaseLayout title="Event Details">
        <Alert icon={<AlertTriangle size={16} />} color="orange">
          <Group>
            <Text>
              This event is hidden or cannot be found. Maybe it never existed...
            </Text>
            <Text size="xl">🤯</Text>
          </Group>
        </Alert>
      </BaseLayout>
    );
  }

  const availabilities = event.availabilities as AvailabilityDataWithOwner[];

  return (
    <BaseLayout title="Event Details">
      {!event.published && <UnpublishedEventWarning mb="lg" />}
      <AvailabilityModalProvider>
        <AvailabilityModal selectedDate={selectedDate} />
        <EmojiSelectorModalProvider>
          <EmojiSelectorModal />

          {!!event && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventDescription event={event} />
            </motion.div>
          )}

          {!!event && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <AvailabilityCalendar
                event={event}
                availabilities={availabilities}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </motion.div>
          )}

          {!!selectedDate && event && !!slug && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OwnAvailability
                selectedDate={selectedDate}
                availabilities={availabilities}
                eventId={event.id}
                isEventPublished={event.published}
              />
              <AvailabilityList
                selectedDate={selectedDate}
                availabilities={availabilities}
                disableReactions={!event.published}
              />
            </motion.div>
          )}
        </EmojiSelectorModalProvider>
      </AvailabilityModalProvider>
    </BaseLayout>
  );
};

export default EventDetailsPage;
