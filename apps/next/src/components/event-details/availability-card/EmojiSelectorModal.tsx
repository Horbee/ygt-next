import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Modal } from "@mantine/core";

import { useEmojiSelectorModal } from "../../../context/EmojiSelectorModalProvider";

export const EmojiSelectorModal = () => {
  const { opened, closeModal, handleAddReaction, selectedAvailabilityId } =
    useEmojiSelectorModal();

  return (
    <Modal.Root opened={opened} onClose={closeModal} size="auto">
      <Modal.Overlay opacity={0.55} blur={3} />
      <Modal.Content radius="lg">
        <Picker data={data} onEmojiSelect={handleAddReaction(selectedAvailabilityId!)} />
      </Modal.Content>
    </Modal.Root>
  );
};
