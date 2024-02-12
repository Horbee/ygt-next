import { motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

const EventDetailsPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const { selectedDate, setSelectedDate } = useSelectedDate();

  const getEvent = api.event.getEventBySlug.useQuery(
    { slug, withAvailabilities: true },
    {
      enabled: !!slug,
    }
  );

  const event = getEvent.data;
  const availabilities = event?.availabilities as AvailabilityDataWithOwner[];

  return (
    <BaseLayout title="Event Details">
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
              />
              <AvailabilityList
                selectedDate={selectedDate}
                availabilities={availabilities}
              />
            </motion.div>
          )}
        </EmojiSelectorModalProvider>
      </AvailabilityModalProvider>
    </BaseLayout>
  );
};

export default EventDetailsPage;
