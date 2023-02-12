import { StylesConfig } from "react-select";

import { useMantineTheme } from "@mantine/core";

export const useCombinedStyles = (): StylesConfig => {
  const mantineTheme = useMantineTheme();

  const isDark = mantineTheme.colorScheme === "dark";

  return {
    control: (baseStyles) => ({
      ...baseStyles,
      borderColor: isDark ? "#373A40" : "#ced4da",
      minHeight: "36px",
      boxShadow: "none",
      backgroundColor: isDark ? "#25262b" : "#fff",
      [":hover"]: {
        borderColor: isDark ? "#2684FF" : "#ced4da",
      },
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: isDark ? "#C1C2C5" : "black",
    }),
    valueContainer: (baseStyles) => ({
      ...baseStyles,
      lineHeight: "1.3",
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: isDark ? "#25262b" : "#fff",
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      color: isDark ? "#C1C2C5" : "black",
      backgroundColor: isDark ? "#25262b" : "#fff",
      [":hover"]: {
        backgroundColor: isDark ? mantineTheme.colors.dark[4] : mantineTheme.colors.gray[1],
      },
      [":active"]: {
        backgroundColor: isDark ? "#25262b" : "#fff",
      },
    }),
  };
};
