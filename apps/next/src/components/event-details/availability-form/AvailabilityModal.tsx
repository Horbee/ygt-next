import { toast } from "react-toastify";

import { Modal, Text, useMantineTheme } from "@mantine/core";

import { useAvailabilityModal } from "../../../context";
import { api } from "../../../utils/api";
import { formatDateTime } from "../../../utils/format-date-time";
import { AvailabilityForm } from "./AvailabilityForm";

import type { ModalProps } from "@mantine/core";
import type { AvailabilityFormValues } from "../../../types";
interface AvailabilityFormModalProps extends Omit<ModalProps, "opened" | "onClose"> {
  selectedDate: Date | null;
}

export const AvailabilityModal = ({
  selectedDate,
  ...restProps
}: AvailabilityFormModalProps) => {
  const {
    opened,
    selectedAvailability,
    eventId,
    closeModal,
    createAvailability,
    updateAvailability,
  } = useAvailabilityModal();

  const theme = useMantineTheme();

  const utils = api.useContext();

  const saveAvailability = async ({
    fromTime,
    untilTime,
    available,
    comment,
  }: AvailabilityFormValues) => {
    try {
      const document = {
        available: available!,
        comment,
        date: selectedDate!,
        fromTime: formatDateTime(selectedDate!, fromTime, false),
        untilTime: formatDateTime(selectedDate!, untilTime, false),
        eventId: eventId!,
      };

      const promise = selectedAvailability
        ? updateAvailability(document)
        : createAvailability(document);

      await toast.promise(promise, {
        pending: "Saving...",
        success: "Availability saved 👌",
        error: "Availability not sent 🤯",
      });

      closeModal();

      utils.event.getEventBySlug.invalidate();
    } catch (error: any) {
      toast.error(error.message || "Availability not sent.");
    }
  };

  return (
    <Modal
      title="Are you available?"
      overlayProps={{
        color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={closeModal}
      {...restProps}
    >
      <Text>{selectedDate?.toDateString()}</Text>
      <AvailabilityForm
        submitCallback={saveAvailability}
        selectedAvailability={selectedAvailability}
      />
    </Modal>
  );
};
