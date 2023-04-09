import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { FaGithub } from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";

import { ActionIcon, Anchor, Box, Card, Container, Group, Text } from "@mantine/core";

import { HeadContent } from "../../components/HeadContent";

const MotionContainer = motion(Container);

export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      <HeadContent title="About" />

      <MotionContainer
        key="about-page"
        size="sm"
        px="xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Group spacing="xs">
          <ActionIcon size="xl" onClick={() => router.back()}>
            <MdChevronLeft size={34} />
          </ActionIcon>
          <Text component="h3" fz="xl" truncate>
            About
          </Text>
        </Group>

        <Card shadow="sm" p="lg" radius="md" mt="lg" withBorder>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>You've got time</Text>
            <Anchor href="https://github.com/Horbee/ygt-next">
              <FaGithub size={25} />
            </Anchor>
          </Group>

          <Text size="sm" color="dimmed">
            You've got time is a web application built with the T3 Stack, using
            technologies like Next.js, TypeScript, tRPC, MongoDB and Matine-UI that helps
            you organize events and handle user availabilities.
            <Box mt="sm">
              <Anchor href="https://github.com/Horbee/ygt-next">
                https://github.com/Horbee/ygt-next
              </Anchor>
            </Box>
          </Text>

          <Text weight={500} my="lg">
            Technologies used
          </Text>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#909296",
            }}
          >
            <li>
              <Anchor href="https://create.t3.gg/">T3 Stack</Anchor>- take a look here if
              you want to know more about it
            </li>
            <li>
              Next.js: A React-based framework for building server-side rendered (SSR) and
              statically generated (SSG) websites and applications.
            </li>
            <li>
              TypeScript: A statically typed superset of JavaScript that helps you write
              more maintainable and scalable code.
            </li>
            <li>
              NextAuth: An authentication library for Next.js that supports multiple
              providers and is easy to set up.
            </li>
            <li>
              Prisma: An open-source database toolkit that provides a high-level API for
              accessing databases, which makes it easy to implement database migrations,
              manage relationships, and perform CRUD operations.
            </li>
            <li>
              tRPC: A framework for building modern and fast APIs with TypeScript and
              Next.js, designed for simplicity and scalability.
            </li>
            <li>
              MongoDB: A popular, cross-platform, NoSQL database used for storing
              high-volume, high-velocity data.
            </li>
            <li>
              Mantine-UI: A fully featured React components library which includes more
              than 100 customizable components and 40 hooks.
            </li>
            <li>Web-Push: Sending push notifications with the Web Push protocol</li>
          </ul>

          <Text weight={500} my="lg">
            Attributions
          </Text>

          <Anchor href="https://www.flaticon.com/free-icons/time" title="time icons">
            Time icons created by Ilham Fitrotul Hayat - Flaticon
          </Anchor>
        </Card>
      </MotionContainer>
    </>
  );
}
