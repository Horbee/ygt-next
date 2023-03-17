import { useState } from "react";

import { Box, Button, SimpleGrid, Stack, Textarea } from "@mantine/core";
import { Attachment } from "@prisma/client";

import { useEventForm } from "../../hooks";
import { AttachmentSelector } from "../attachment-selector/AttachmentSelector";
import { SwitchInputWrapper, TagsField } from "../fields";
import {
  EventDatesSection,
  EventNameWithSlug,
  ImageShowcase,
  InvitedUsersSection,
} from "./sections";

import type { SubmitHandler } from "react-hook-form";
import type { EventDataForm, EventFormValues } from "../../types";
interface Props {
  submitButtonText: string;
  submitCallback?: (values: EventFormValues, attachment: Attachment | null) => void;
  selectedEvent?: EventDataForm;
  keepSlugValue?: boolean;
}

export const EventForm = ({
  submitButtonText,
  submitCallback,
  selectedEvent,
  keepSlugValue = false,
}: Props) => {
  const [opened, setOpened] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(
    selectedEvent?.coverImage ?? null
  );
  const eventForm = useEventForm(selectedEvent);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = eventForm;

  const onSubmit: SubmitHandler<EventFormValues> = async (values) => {
    submitCallback?.(values, attachment);
  };

  return (
    <Box py="md">
      <AttachmentSelector
        opened={opened}
        setOpened={setOpened}
        onSelect={(attachment) => {
          eventForm.setValue("coverImageUrl", attachment.url);
          setAttachment(attachment);
          setOpened(false);
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <EventNameWithSlug eventForm={eventForm} keepSlugValue={keepSlugValue} />

          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 600, cols: 1 }]}>
            <Textarea
              placeholder="Describe the event..."
              label="Description"
              minRows={8}
              {...register("description")}
            />

            <ImageShowcase
              imgSrc={watch("coverImageUrl") || undefined}
              onDeselect={(e) => {
                e.stopPropagation();
                eventForm.setValue("coverImageUrl", null);
                setAttachment(null);
              }}
              onClick={() => setOpened(true)}
            />
          </SimpleGrid>

          <SwitchInputWrapper<EventFormValues>
            label="Whole Day"
            fieldName="wholeDay"
            control={control}
          />

          <EventDatesSection eventForm={eventForm} />

          <SwitchInputWrapper<EventFormValues>
            label="Is public"
            fieldName="public"
            control={control}
          />

          <InvitedUsersSection eventForm={eventForm} />

          <TagsField eventForm={eventForm} />

          <Button
            type="submit"
            variant="gradient"
            gradient={{ from: "orange", to: "red" }}
            disabled={isSubmitting}
          >
            {submitButtonText}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
