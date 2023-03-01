import { useState } from "react";
import CreatableSelect from "react-select/creatable";

import { Box, Button, Input, Stack, Text, Textarea } from "@mantine/core";

import { useEventForm } from "../../hooks";
import { AttachmentSelector } from "../attachment-selector/AttachmentSelector";
import { EventNameWithSlug, ReactSelectWrapper, SwitchInputWrapper } from "../fields";
import { EventDatesSection, ImageDropzone, InvitedUsersSection } from "./sections";

import type { SubmitHandler } from "react-hook-form";
import type { EventDataForm, EventFormValues } from "../../types";
interface Props {
  submitButtonText: string;
  submitCallback?: (values: EventFormValues, image: File | null) => void;
  selectedEvent?: EventDataForm;
  keepSlugValue?: boolean;
}

export const EventForm = ({
  submitButtonText,
  submitCallback,
  selectedEvent,
  keepSlugValue = false,
}: Props) => {
  const [opened, setOpened] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    submitCallback?.(values, imageFile);
  };

  const setImage = (file: File | null, url: string | null) => {
    setImageFile(file);
    eventForm.setValue("coverImageUrl", url);
  };

  return (
    <Box py="md">
      <AttachmentSelector
        opened={opened}
        setOpened={setOpened}
        onSelect={(attachment) => {
          console.log(attachment);
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

          <ImageDropzone
            setImage={setImage}
            imgSrc={watch("coverImageUrl") || undefined}
          />

          <Textarea
            placeholder="Describe the event..."
            label="Description"
            minRows={5}
            {...register("description")}
          />

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
