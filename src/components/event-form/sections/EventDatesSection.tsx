import { Grid, Text } from "@mantine/core";

import { UseEventForm } from "../../../hooks";
import { EventFormValues } from "../../../types";
import { DatePickerInputWrapper, TimeInputWrapper } from "../../fields";

interface Props {
  eventForm: UseEventForm;
}

export const EventDatesSection = ({ eventForm }: Props) => {
  const {
    watch,
    control,
    formState: { errors },
  } = eventForm;

  const wholeDay = watch("wholeDay");

  return (
    <>
      <Grid>
        <Grid.Col span={wholeDay ? 12 : 6}>
          <DatePickerInputWrapper<EventFormValues>
            fieldName="fromDate"
            control={control}
            label="Start Date"
            rules={{
              required: { message: "Start Date is required", value: true },
            }}
            error={errors.fromDate?.message}
            withAsterisk
          />
        </Grid.Col>
        {!wholeDay && (
          <Grid.Col span={6}>
            <TimeInputWrapper
              label="Start Time"
              fieldName="fromTime"
              control={control}
              clearable
            />
          </Grid.Col>
        )}
      </Grid>

      <Grid>
        <Grid.Col span={wholeDay ? 12 : 6}>
          <DatePickerInputWrapper<EventFormValues>
            fieldName="untilDate"
            control={control}
            label="End Date"
            rules={{
              required: { message: "End Date is required", value: true },
            }}
            error={errors.untilDate?.message}
            withAsterisk
          />
        </Grid.Col>
        {!wholeDay && (
          <Grid.Col span={6}>
            <TimeInputWrapper
              label="End Time"
              fieldName="untilTime"
              control={control}
              clearable
            />
          </Grid.Col>
        )}
      </Grid>

      <Text c="dimmed" fs="italic" fz="sm">
        *Dates are displayed in the format of your local time zone:{" "}
        {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </Text>
    </>
  );
};
