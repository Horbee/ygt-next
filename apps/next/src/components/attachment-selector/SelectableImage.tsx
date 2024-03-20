import { Box, Checkbox, Image, ImageProps, Text } from "@mantine/core";
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
      <Image
        radius="md"
        width={100}
        height={100}
        style={{ cursor: "pointer" }}
        caption={
          <Text lineClamp={2} title={caption}>
            {caption}
          </Text>
        }
        onClick={onSelect}
        {...props}
      />
    </Box>
  );
};
