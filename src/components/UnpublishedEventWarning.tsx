import { Alert, type AlertProps } from "@mantine/core";

import { FiAlertTriangle } from "react-icons/fi";

interface Props extends Omit<AlertProps, "children"> {}

export function UnpublishedEventWarning(props: Props) {
  return (
    <Alert {...props} icon={<FiAlertTriangle size="1rem" />} color="orange">
      Your event is currently set to be unpublished and only you will be able to see it in
      the events list. To allow others to see your event, you need to activate the
      'Publish' button at the top of the form.
    </Alert>
  );
}
