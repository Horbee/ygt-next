import { signOut } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MdChevronLeft, MdLogout } from 'react-icons/md'
import { toast } from 'react-toastify'

import { ActionIcon, Button, Container, Group, Text } from '@mantine/core'

import { ThemeToggler } from './ThemeToggler'

import type { ContainerProps } from "@mantine/core";
import type { ReactNode } from "react";
type Props = ContainerProps & {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
};

export const BaseLayout = ({
  title,
  children,
  showBackButton = true,
  ...restProps
}: Props) => {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    toast.success("Logout successfull");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo512.png" />

        <meta
          name="description"
          content="Web site created to manage availabilities"
        />
        <link rel="apple-touch-icon" href="/logo512.png" />
        <meta name="theme-color" content="#ffffff" />

        <title>You&apos;ve got time?</title>
      </Head>
      <Container size="sm" px="xs" mb="lg" {...restProps}>
        <Group position="apart">
          <Group>
            {showBackButton && (
              <ActionIcon size="xl" onClick={() => router.back()}>
                <MdChevronLeft size={34} />
              </ActionIcon>
            )}
            <Text component="h3" fz="xl" truncate>
              {title}
            </Text>
          </Group>

          <Group>
            <ThemeToggler />
            <Button
              leftIcon={<MdLogout />}
              variant="outline"
              color="red"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Group>
        </Group>
        {children}
      </Container>
    </>
  );
};
