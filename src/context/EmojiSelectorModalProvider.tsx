import { createContext, useContext, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";

import { api } from "../utils/api";

import type { ReactNode } from "react";
const EmojiSelectorModalContext = createContext<
  | {
      selectedAvailabilityId: string | null;
      opened: boolean;
      openModal: (availabilityId: string) => void;
      closeModal: VoidFunction;
      handleAddReaction: (
        availabilityId: string
      ) => (emoji: { native: string; shortcodes: string }) => Promise<void>;
    }
  | undefined
>(undefined);

export const EmojiSelectorModalProvider = ({ children }: { children: ReactNode }) => {
  const [availabilityId, setAvailabilityId] = useState<string | null>(null);
  const [opened, { open: openInternal, close: closeModal }] = useDisclosure(false, {
    onClose: () => setAvailabilityId(null),
  });
  const utils = api.useContext();

  const addOrRemoveReaction = api.availability.toggleUserReaction.useMutation({
    onSuccess: () => {
      utils.event.getEventBySlug.invalidate();
    },
  });

  const openModal = (availabilityId: string) => {
    setAvailabilityId(availabilityId);
    openInternal();
  };

  // With this curried function we handle the case when no modal is open and reaction is getting removed by clicking on it
  const handleAddReaction =
    (availabilityId: string) => async (emoji: { native: string; shortcodes: string }) => {
      closeModal();

      try {
        await addOrRemoveReaction.mutateAsync({
          availabilityId,
          reaction: { native: emoji.native, shortcodes: emoji.shortcodes },
        });
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Reaction is not added");
      }
    };

  return (
    <EmojiSelectorModalContext.Provider
      value={{
        selectedAvailabilityId: availabilityId,
        opened,
        openModal,
        closeModal,
        handleAddReaction,
      }}
    >
      {children}
    </EmojiSelectorModalContext.Provider>
  );
};

export const useEmojiSelectorModal = () => {
  const ctx = useContext(EmojiSelectorModalContext);

  if (ctx === undefined) {
    throw Error("useEmojiSelectorModal must be used within EmojiSelectorModalProvider");
  }

  return ctx;
};
