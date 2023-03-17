import { useEffect } from "react";

import { Text, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

import { UseEventForm } from "../../../hooks";
import { api } from "../../../utils/api";
import { EventNameField } from "../../fields";

interface Props {
  eventForm: UseEventForm;
  keepSlugValue?: boolean;
}

export function EventNameWithSlug({ eventForm, keepSlugValue }: Props) {
  const {
    watch,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
    control,
  } = eventForm;

  const slug = watch("slug");

  const [debouncedSlug] = useDebouncedValue(slug, 500);

  const isSlugTaken = api.event.isSlugTaken.useQuery(
    { slug: debouncedSlug },
    { enabled: !keepSlugValue }
  );

  useEffect(() => {
    if (isSlugTaken.data) {
      setError("slug", { type: "required", message: "This slug is already taken" });
    } else {
      clearErrors("slug");
    }
  }, [isSlugTaken.data]);

  return (
    <div>
      <EventNameField
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

      <Text fz="sm">Slug: {slug}</Text>

      {!!errors.slug && (
        <Text color="red" size="xs">
          {errors.slug.message}
        </Text>
      )}
    </div>
  );
}
