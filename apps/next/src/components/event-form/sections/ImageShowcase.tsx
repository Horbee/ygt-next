import { MouseEvent } from "react";
import { Image, Trash } from "lucide-react";
import {
  ActionIcon,
  Box,
  Group,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

import { WithBackgroundImage } from "../../attachment-selector/WithBackgroundImage";

interface Props {
  imgSrc?: string;
  onDeselect: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onClick: () => void;
}

export const ImageShowcase = ({ imgSrc, onDeselect, onClick }: Props) => {
  const { colors } = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Box
      c="div"
      onClick={onClick}
      style={{
        border: `2px dashed ${colors.gray[isDark ? 8 : 4]}`,
        borderRadius: "4px",
        backgroundColor: isDark ? colors.dark[6] : "white",
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          backgroundColor: isDark ? colors.dark[5] : colors.gray[1],
        },
      }}
      data-testid="image-selector"
    >
      {imgSrc && (
        <ActionIcon
          variant="outline"
          color="red"
          top={5}
          right={5}
          pos="absolute"
          onClick={onDeselect}
        >
          <Trash size={16} />
        </ActionIcon>
      )}

      <WithBackgroundImage imgSrc={imgSrc}>
        <Group align="center" gap="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
          {!imgSrc && (
            <>
              <Image size={50} />

              <div>
                <Text size="xl" inline>
                  Click to select image
                </Text>
              </div>
            </>
          )}
        </Group>
      </WithBackgroundImage>
    </Box>
  );
};
