import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import { MdChevronLeft } from "react-icons/md"

import { ActionIcon, Container, Group, Text } from "@mantine/core"

import { useCreateSubscription } from "../hooks/useCreateSubscription"
import { AppHeader } from "./app-header"
import { AppNavbar } from "./app-navbar"
import { HeadContent } from "./HeadContent"

import type { ContainerProps } from "@mantine/core";
type Props = ContainerProps & {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  actionElement?: ReactNode;
};

export const BaseLayout = ({
  title,
  children,
  showBackButton = true,
  backUrl,
  actionElement,
  ...restProps
}: Props) => {
  const [navOpened, setNavOpened] = useState(false);

  const router = useRouter();

  useCreateSubscription();

  return (
    <>
      <HeadContent title={title} />
      <AppHeader opened={navOpened} toggleOpened={() => setNavOpened((o) => !o)} />
      <AppNavbar opened={navOpened} onClose={() => setNavOpened(false)} />
      <Container size="sm" px="xs" mb="lg" {...restProps}>
        <Group position="apart">
          <Group spacing="xs">
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

          {actionElement}
        </Group>
        {children}
      </Container>
    </>
  );
};
