import { BsMoonFill, BsSun } from "react-icons/bs";

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
      {isDark ? <BsSun size={18} /> : <BsMoonFill size={18} />}
    </ActionIcon>
  );
};
