import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { MdChevronLeft } from "react-icons/md";

import {
  ActionIcon,
  AppShell,
  Aside,
  Container,
  Group,
  MediaQuery,
  Text,
} from "@mantine/core";

import { AppHeader } from "./app-header";
import { AppNavbar } from "./app-navbar";
import { HeadContent } from "./HeadContent";

import type { ContainerProps } from "@mantine/core";
type Props = ContainerProps & {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
};

export const BaseLayout = ({
  title,
  children,
  showBackButton = true,
  backUrl,
  ...restProps
}: Props) => {
  const [navOpened, setNavOpened] = useState(false);

  const router = useRouter();

  return (
    <>
      <HeadContent title={title} />

      <AppShell
        navbarOffsetBreakpoint="sm"
        header={
          <AppHeader opened={navOpened} toggleOpened={() => setNavOpened((o) => !o)} />
        }
        navbar={<AppNavbar opened={navOpened} />}
      >
        <Container size="sm" px="xs" mb="lg" {...restProps}>
          <Group>
            {showBackButton && (
              <ActionIcon
                size="xl"
                onClick={() => (backUrl ? router.push(backUrl) : router.back())}
              >
                <MdChevronLeft size={34} />
              </ActionIcon>
            )}
            <Text component="h3" fz="xl" truncate>
              {title}
            </Text>
          </Group>
          {children}
        </Container>
      </AppShell>
    </>
  );
};
