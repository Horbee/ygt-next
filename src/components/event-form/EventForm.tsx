import { useState } from "react";
import CreatableSelect from "react-select/creatable";

import {
  Box,
  Button,
  Group,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { Attachment } from "@prisma/client";

import { useEventForm } from "../../hooks";
import { AttachmentSelector } from "../attachment-selector/AttachmentSelector";
import { EventNameWithSlug, ReactSelectWrapper, SwitchInputWrapper } from "../fields";
import { EventDatesSection, ImageShowcase, InvitedUsersSection } from "./sections";

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
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const eventForm = useEventForm(selectedEvent);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
    setValue,
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
          <EventNameWithSlug
            withAsterisk
            label="Event name"
            control={control}
            fieldName="name"
            rules={{ required: "Event Name is required" }}
            setSlugValue={(slug) => {
              if (!keepSlugValue) setValue("slug", slug);
            }}
            error={errors.name?.message}
          />

          <Text fz="sm">Slug: {watch("slug")}</Text>

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

          <Input.Wrapper label="Tags">
            <ReactSelectWrapper
              as={CreatableSelect<string, true>}
              placeholder="Add some tags..."
              control={control}
              isMulti
              fieldName="tags"
            />
          </Input.Wrapper>

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
