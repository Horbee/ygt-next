import { Navbar, Text } from "@mantine/core";

interface Props {
  opened: boolean;
}

export const AppNavbar = ({ opened }: Props) => {
  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      <Text>Application navbar</Text>
    </Navbar>
  );
};
