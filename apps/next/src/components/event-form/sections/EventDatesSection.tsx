import isSameDay from "date-fns/isSameDay";

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
          <div data-testid="start-date-wrapper">
            <DatePickerInputWrapper<EventFormValues>
              clearable
              fieldName="fromDate"
              control={control}
              label="Start Date"
              title="Start Date"
              rules={{
                required: { message: "Start Date is required", value: true },
              }}
              error={errors.fromDate?.message}
              withAsterisk
              data-testid="start-date-input"
            />
          </div>
        </Grid.Col>
        {!wholeDay && (
          <Grid.Col span={6}>
            <TimeInputWrapper
              label="Start Time"
              fieldName="fromTime"
              control={control}
              rules={{
                required: {
                  message: 'Start Time is required if "Whole Day" is not checked',
                  value: true,
                },
              }}
              error={errors.fromTime?.message}
              withAsterisk
            />
          </Grid.Col>
        )}
      </Grid>

      <Grid>
        <Grid.Col span={wholeDay ? 12 : 6}>
          <div data-testid="end-date-wrapper">
            <DatePickerInputWrapper<EventFormValues>
              clearable
              fieldName="untilDate"
              control={control}
              label="End Date"
              title="End Date"
              rules={{
                required: { message: "End Date is required", value: true },
                validate: (value, formValues) =>
                  (formValues.fromDate && (value as Date) >= formValues.fromDate) ||
                  "End Date must be >= Start Date",
              }}
              error={errors.untilDate?.message}
              withAsterisk
              data-testid="end-date-input"
            />
          </div>
        </Grid.Col>
        {!wholeDay && (
          <Grid.Col span={6}>
            <TimeInputWrapper
              label="End Time"
              fieldName="untilTime"
              control={control}
              rules={{
                required: {
                  message: 'End Time is required if "Whole Day" is not checked',
                  value: true,
                },
                validate: (value, formValues) => {
                  if (
                    formValues.fromDate &&
                    formValues.untilDate &&
                    formValues.fromTime &&
                    value &&
                    isSameDay(formValues.fromDate, formValues.untilDate) &&
                    value < formValues.fromTime
                  ) {
                    return "End Time must be >= Start Time";
                  }

                  return true;
                },
              }}
              error={errors.untilTime?.message}
              withAsterisk
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
