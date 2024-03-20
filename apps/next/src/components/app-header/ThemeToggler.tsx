import { Sun, Moon } from "lucide-react";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";

export const ThemeToggler = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={isDark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
  );
};
