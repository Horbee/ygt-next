import { FaTimes } from "react-icons/fa";
import { MultiValueProps } from "react-select";

import { ActionIcon, Badge } from "@mantine/core";

export const MultiValue = ({ children, ...props }: MultiValueProps) => {
  const removeButton = (
    <ActionIcon
      size="xs"
      color="orange"
      variant="transparent"
      onClick={props.removeProps.onClick as any}
    >
      <FaTimes size={10} />
    </ActionIcon>
  );

  return (
    <Badge variant="outline" color="orange" mr="xs" rightSection={removeButton}>
      {children}
    </Badge>
  );
};
