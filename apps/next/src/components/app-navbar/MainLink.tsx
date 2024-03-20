import Link from "next/link";
import { ReactNode } from "react";

import {
  createStyles,
  DefaultMantineColor,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";

interface Props {
  label: string;
  icon: ReactNode;
  color: DefaultMantineColor;
  href: string;
  onClose: () => void;
}

export const MainLink = ({ label, icon, color, href, onClose }: Props) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton
      component={Link}
      href={href}
      onClick={onClose}
      className={classes.linkBtn}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const useStyles = createStyles((theme) => ({
  linkBtn: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));
