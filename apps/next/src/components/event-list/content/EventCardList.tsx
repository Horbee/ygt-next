import { motion } from "framer-motion";
import Image from "next/image";

import { Group, Paper, Text } from "@mantine/core";
import { Attachment, Event } from "@ygt/db";

import { EventCard } from "./event-card/EventCard";

interface Props {
  events: (Event & {
    coverImage: Attachment | null;
  })[];
}

export const EventCardList = ({ events }: Props) => {
  if (events.length === 0) {
    return (
      <Paper withBorder shadow="xs" p="md">
        <Group>
          <Image src="/no-event.svg" alt="no-event" width={100} height={100} />
          <Text>No events here...</Text>
        </Group>
      </Paper>
    );
  }

  return (
    <>
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </>
  );
};
