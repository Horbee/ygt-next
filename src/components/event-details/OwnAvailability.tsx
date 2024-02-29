import isSameDay from "date-fns/isSameDay";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useMemo } from "react";
import { Pencil, Trash } from "lucide-react";
import { ActionIcon, Button, Group } from "@mantine/core";

import { useAvailabilityModal } from "../../context";
import { api } from "../../utils/api";
import { AvailabilityCard } from "./availability-card";

import type { AvailabilityDataWithOwnerAndReactions } from "../../types";

interface OwnAvailabilityProps {
  selectedDate: Date;
  availabilities: AvailabilityDataWithOwnerAndReactions[];
  eventId: string;
  isEventPublished: boolean;
}

export const OwnAvailability = ({
  selectedDate,
  availabilities,
  eventId,
  isEventPublished,
}: OwnAvailabilityProps) => {
  const session = useSession();
  const userId = session.data?.user.id;
  const utils = api.useContext();

  const { openModal } = useAvailabilityModal();

  const deleteAvailability = api.availability.deleteById.useMutation({
    onSuccess: () => {
      utils.event.getEventBySlug.invalidate();
    },
  });

  const myAvailability = useMemo(() => {
    return availabilities.find(
      (a) => isSameDay(new Date(a.date), selectedDate) && a.ownerId === userId
    );
  }, [availabilities, selectedDate, userId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteAvailability.mutateAsync(myAvailability!.id);
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Availability is not deleted");
      }
    }
  };

  return (
    <div>
      <Group position="apart">
        <h4>Own Availability:</h4>

        <Group>
          <ActionIcon
            color="orange"
            variant="outline"
            onClick={() => openModal(myAvailability, eventId)}
            disabled={!myAvailability || !isEventPublished}
          >
            <Pencil size={16} />
          </ActionIcon>

          <ActionIcon
            color="red"
            variant="outline"
            onClick={handleDelete}
            disabled={!myAvailability || !isEventPublished}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {myAvailability ? (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AvailabilityCard av={myAvailability} disableReactions={!isEventPublished} />
        </motion.div>
      ) : (
        <Button
          variant="gradient"
          gradient={{ from: "teal", to: "lime", deg: 105 }}
          onClick={() => openModal(undefined, eventId)}
          disabled={!isEventPublished}
        >
          Create Availability
        </Button>
      )}
    </div>
  );
};
