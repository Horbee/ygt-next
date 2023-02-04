import { Button, Stack, Textarea } from "@mantine/core";

import { useAvailabilityForm } from "../../../hooks";
import { AppointmentTimeInput, AvailabilitySelect } from "../../fields";

import type { Availability } from "@prisma/client";
import type { AvailabilityFormValues } from "../../../types";
import type { SubmitHandler } from "react-hook-form";
interface AvailabilityFormProps {
  submitCallback?: (values: AvailabilityFormValues) => void;
  selectedAvailability?: Availability;
}

export const AvailabilityForm = ({
  submitCallback,
  selectedAvailability,
}: AvailabilityFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useAvailabilityForm(selectedAvailability);

  const onSubmit: SubmitHandler<AvailabilityFormValues> = async (values) => {
    submitCallback?.(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <AvailabilitySelect control={control} />

        <AppointmentTimeInput control={control} />

        <Textarea
          placeholder="Your comment"
          label="Your comment"
          {...register("comment")}
        />

        <Button
          type="submit"
          variant="gradient"
          gradient={{ from: "orange", to: "red" }}
          disabled={isSubmitting}
        >
          Send
        </Button>
      </Stack>
    </form>
  );
};
