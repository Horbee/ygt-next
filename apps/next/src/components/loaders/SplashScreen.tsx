import { motion } from "framer-motion";
import React from "react";

import { Center, Image, Stack, Text, Title } from "@mantine/core";

const MotionTitle = motion(Title);
const MotionImage = motion(Image);

export const SplashScreen = () => {
  return (
    <motion.div exit={{ opacity: 0, transition: { delay: 0.5 } }}>
      <Center maw={400} h="90vh" mx="auto">
        <Stack align="center">
          <MotionImage src="/logo192.png" width={100} exit={{ scale: 1.5, y: 20 }} />
          <MotionTitle exit={{ opacity: 0 }}>You've got time</MotionTitle>
        </Stack>
      </Center>

      <Stack align="center" spacing="xs">
        <Text fz="sm" color="dimmed">
          Created By
        </Text>
        <Text fz="md" truncate>
          Norbert Horgas
        </Text>
      </Stack>
    </motion.div>
  );
};
