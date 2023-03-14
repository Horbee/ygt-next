import { motion } from "framer-motion";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { BaseLayout } from "../../../components/BaseLayout";
import {
  AvailabilityCalendar,
  AvailabilityList,
  AvailabilityModal,
  EventDescription,
  OwnAvailability,
} from "../../../components/event-details";
import { AvailabilityModalProvider } from "../../../context";
import { useAuthenticatedRedirect } from "../../../hooks";
import { AvailabilityDataWithOwner } from "../../../types";
import { api } from "../../../utils/api";

const EventDetailsPage: NextPage = () => {
  useAuthenticatedRedirect("/login");
  const router = useRouter();
  const slug = router.query.slug as string;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
      </AvailabilityModalProvider>
    </BaseLayout>
  );
};

export default EventDetailsPage;
