import { Badge } from "@mantine/core";

import type { AvailableTypes } from "../../../types";

export const AvailabilityBadge = ({ type }: { type: AvailableTypes }) => {
  const data = getAvailabilityBadge(type);

  return (
    <Badge color={data.color} variant="light">
      {data.text}
    </Badge>
  );
};

const getAvailabilityBadge = (available: AvailableTypes) => {
  switch (available) {
    case "good":
      return { text: "Available", color: "green" };
    case "maybe":
      return { text: "Maybe", color: "orange" };
    case "notgood":
      return { text: "Not Available", color: "red" };
    default:
      return { text: "Default", color: "yellow" };
  }
};
