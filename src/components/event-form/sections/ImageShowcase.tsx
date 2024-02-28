import { MouseEvent } from "react";
import { Image, Trash } from "lucide-react";
import { ActionIcon, Box, createStyles, Group, Text } from "@mantine/core";

import { WithBackgroundImage } from "../../attachment-selector/WithBackgroundImage";

interface Props {
  imgSrc?: string;
  onDeselect: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onClick: () => void;
}

export const ImageShowcase = ({ imgSrc, onDeselect, onClick }: Props) => {
  const { classes } = useStyles();

  return (
    <Box c="div" onClick={onClick} className={classes.container}>
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
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 220, pointerEvents: "none" }}
        >
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

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === "dark";

  return {
    container: {
      border: `2px dashed ${theme.colors.gray[isDark ? 8 : 4]}`,
      borderRadius: "4px",
      backgroundColor: isDark ? theme.colors.dark[6] : "white",
      cursor: "pointer",
      position: "relative",
      "&:hover": {
        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
      },
    },
  };
});
