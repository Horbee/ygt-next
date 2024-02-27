import isSameDay from "date-fns/isSameDay";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { Stack } from "@mantine/core";

import { AvailabilityCard } from "./availability-card";

import type { AvailabilityDataWithOwner } from "../../types";

interface Props {
  selectedDate: Date;
  availabilities: AvailabilityDataWithOwner[];
  disableReactions?: boolean;
}

export const AvailabilityList = ({
  selectedDate,
  availabilities,
  disableReactions,
}: Props) => {
  const session = useSession();
  const userId = session.data?.user.id;

  const filteredAvailabilities = useMemo(() => {
    return availabilities
      .filter((a) => isSameDay(new Date(a.date), selectedDate) && a.ownerId !== userId)
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }, [availabilities, selectedDate, userId]);

  return (
    <div>
      <h4>Availability of others:</h4>

      <Stack>
        {filteredAvailabilities.map((av, i) => (
          <motion.div
            key={av.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.2 }}
          >
            <AvailabilityCard av={av} disableReactions={disableReactions} />
          </motion.div>
        ))}
      </Stack>
    </div>
  );
};
