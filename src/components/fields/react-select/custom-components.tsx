import { FaTimes } from "react-icons/fa"
import { MultiValueProps } from "react-select"

import { ActionIcon, Badge } from "@mantine/core"

export const MultiValue = ({ children, removeProps }: MultiValueProps) => {
  const removeButton = (
    <ActionIcon
      size="xs"
      color="orange"
      variant="transparent"
      onClick={removeProps.onClick as any}
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
