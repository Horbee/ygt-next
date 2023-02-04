import { createContext, useContext, useState } from "react";

import { Availability } from "@prisma/client";

import { api } from "../utils/api";

import type { ReactNode } from "react";
const AvailabilityModalContext = createContext<
  | {
      opened: boolean;
      selectedAvailability?: Availability;
      eventId?: string;
      openModal: (myAvailability?: Availability, eventId?: string) => void;
      closeModal: VoidFunction;
      updateAvailability: (doc: any) => Promise<Availability>;
      createAvailability: (doc: any) => Promise<Availability>;
    }
  | undefined
>(undefined);

export const AvailabilityModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [opened, setOpened] = useState(false);
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability>();
  const [eventId, setEventId] = useState<string>();

  const create = api.availability.create.useMutation();
  const update = api.availability.updateById.useMutation();

  const openModal = (myAvailability?: Availability, eventId?: string) => {
    setSelectedAvailability(myAvailability);
    setEventId(eventId);
    setOpened(true);
  };

  const closeModal = () => setOpened(false);

  const updateAvailability = (doc: any) => {
    return update.mutateAsync({
      availabilityId: selectedAvailability!.id,
      dto: doc,
    });
  };

  const createAvailability = (doc: any) => {
    return create.mutateAsync(doc);
  };

  return (
    <AvailabilityModalContext.Provider
      value={{
        opened,
        selectedAvailability,
        eventId,
        openModal,
        closeModal,
        updateAvailability,
        createAvailability,
      }}
    >
      {children}
    </AvailabilityModalContext.Provider>
  );
};

export const useAvailabilityModal = () => {
  const ctx = useContext(AvailabilityModalContext);

  if (ctx === undefined) {
    throw Error(
      "useAvailabilityModal must be used within AvailabilityModalProvider"
    );
  }

  return ctx;
};
