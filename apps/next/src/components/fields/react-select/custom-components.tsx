import { MultiValueProps } from "react-select";

import { ActionIcon, Badge } from "@mantine/core";
import { X } from "lucide-react";

export const MultiValue = ({ children, ...props }: MultiValueProps) => {
  const removeButton = (
    <ActionIcon
      size="xs"
      color="orange"
      variant="transparent"
      onClick={props.removeProps.onClick as any}
    >
      <X strokeWidth={4} size={12} />
    </ActionIcon>
  );

  return (
    <Badge variant="outline" color="orange" mr="xs" rightSection={removeButton}>
      {children}
    </Badge>
  );
};
