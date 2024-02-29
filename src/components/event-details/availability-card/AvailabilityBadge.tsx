import { Badge } from "@mantine/core";

import type { AvailabilityType } from "@prisma/client";

export const AvailabilityBadge = ({ type }: { type: AvailabilityType }) => {
  const { color, text } = getAvailabilityBadge(type);

  return (
    <Badge color={color} variant="light">
      {text}
    </Badge>
  );
};

const getAvailabilityBadge = (available: AvailabilityType) => {
  switch (available) {
    case "GOOD":
      return { text: "Available", color: "green" };
    case "MAYBE":
      return { text: "Maybe", color: "orange" };
    case "NOT_GOOD":
      return { text: "Not Available", color: "red" };
    default:
      return { text: "Default", color: "yellow" };
  }
};
