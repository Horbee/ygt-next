import { toast } from "react-toastify";

import { Modal, Text, useMantineTheme } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { useAvailabilityModal } from "../../../context";
import { api } from "../../../utils/api";
import { AvailabilityForm } from "./AvailabilityForm";

import type { ModalProps } from "@mantine/core";
import type { AvailabilityFormValues } from "../../../types";
interface AvailabilityFormModalProps
  extends Omit<ModalProps, "opened" | "onClose"> {
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

  const saveAvailability = async (values: AvailabilityFormValues) => {
    try {
      const { time, available, comment } = values;
      const document = {
        available: available!,
        comment,
        date: selectedDate!,
        fromTime: time[0] ?? null,
        untilTime: time[1] ?? null,
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
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
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
