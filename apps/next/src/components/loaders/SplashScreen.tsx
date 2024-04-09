import { motion } from "framer-motion";
import { Center, Stack, Text, Title } from "@mantine/core";

const MotionTitle = motion(Title);

export const SplashScreen = () => {
  return (
    <motion.div exit={{ opacity: 0, transition: { delay: 0.5 } }}>
      <Center maw={400} h="90vh" mx="auto">
        <Stack align="center">
          <motion.img
            alt="logo"
            src="/logo192.png"
            style={{ width: "100px" }}
            exit={{ scale: 1.5, y: 20 }}
          />
          <MotionTitle exit={{ opacity: 0 }}>You've got time</MotionTitle>
        </Stack>
      </Center>

      <Stack align="center" gap="xs">
        <Text fz="sm" c="dimmed">
          Created By
        </Text>
        <Text fz="md" truncate>
          Norbert Horgas
        </Text>
      </Stack>
    </motion.div>
  );
};
