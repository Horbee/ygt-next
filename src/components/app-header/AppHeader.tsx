import { useRouter } from "next/router";

import { Burger, Group, Header, Image, Title, useMantineTheme } from "@mantine/core";

import { ThemeToggler } from "./ThemeToggler";

interface Props {
  opened: boolean;
  toggleOpened: () => void;
}

export const AppHeader = ({ opened, toggleOpened }: Props) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Header height="auto" p="xs">
      <Group position="apart">
        <Burger
          opened={opened}
          onClick={toggleOpened}
          size="sm"
          color={theme.colors.gray[6]}
        />

        <Group style={{ cursor: "pointer" }} onClick={() => router.push("/events")}>
          <Image src="/favicon-32x32.png" width={32} />
          <Title order={3}>You've got time</Title>
        </Group>

        <ThemeToggler />
      </Group>
    </Header>
  );
};
