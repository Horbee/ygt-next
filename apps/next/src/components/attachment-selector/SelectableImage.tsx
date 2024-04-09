import NextImage from "next/image";

import { Box, Checkbox, Image, ImageProps, Text, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";

interface Props extends ImageProps {
  caption: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const SelectableImage = ({ caption, isSelected, onSelect, ...props }: Props) => {
  const { hovered, ref } = useHover();

  return (
    <Box pos="relative" ref={ref}>
      <Checkbox
        checked={isSelected}
        pos="absolute"
        top="5px"
        left="5px"
        style={{ zIndex: 1, display: isSelected || hovered ? "block" : "none" }}
        onChange={() => onSelect()}
      />
      <Tooltip label={caption}>
        <Image
          alt={caption}
          component={NextImage}
          radius="md"
          w={100}
          h={100}
          style={{ cursor: "pointer" }}
          onClick={onSelect}
          {...props}
        />
      </Tooltip>
    </Box>
  );
};
