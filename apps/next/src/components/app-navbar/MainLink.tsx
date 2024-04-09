import Link from "next/link";
import { ReactNode } from "react";

import {
  DefaultMantineColor,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

interface Props {
  label: string;
  icon: ReactNode;
  color: DefaultMantineColor;
  href: string;
  onClose: () => void;
}

export const MainLink = ({ label, icon, color, href, onClose }: Props) => {
  const { spacing, radius, colors, black } = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <UnstyledButton
      component={Link}
      href={href}
      onClick={onClose}
      style={{
        display: "block",
        width: "100%",
        padding: spacing.xs,
        borderRadius: radius.sm,
        color: colorScheme === "dark" ? colors.dark[0] : black,

        "&:hover": {
          backgroundColor: colorScheme === "dark" ? colors.dark[6] : colors.gray[0],
        },
      }}
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
