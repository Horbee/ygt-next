import isSameDay from "date-fns/isSameDay";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

import { ActionIcon, Button, Group } from "@mantine/core";

import { useAvailabilityModal } from "../../context";
import { api } from "../../utils/api";
import { AvailabilityCard } from "./availability-card";

import type { AvailabilityDataWithOwner } from "../../types";
import { useMemo } from "react";
interface OwnAvailabilityProps {
  selectedDate: Date;
  availabilities: AvailabilityDataWithOwner[];
  eventId: string;
}

export const OwnAvailability = ({
  selectedDate,
  availabilities,
  eventId,
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
            disabled={!myAvailability}
          >
            <MdEdit size={18} />
          </ActionIcon>

          <ActionIcon
            color="red"
            variant="outline"
            onClick={handleDelete}
            disabled={!myAvailability}
          >
            <MdDelete size={18} />
          </ActionIcon>
        </Group>
      </Group>

      {myAvailability ? (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AvailabilityCard av={myAvailability} />
        </motion.div>
      ) : (
        <Button
          variant="gradient"
          gradient={{ from: "teal", to: "lime", deg: 105 }}
          onClick={() => openModal(undefined, eventId)}
        >
          Create Availability
        </Button>
      )}
    </div>
  );
};
