import Link from "next/link";
import { MdAdd } from "react-icons/md";

import { ActionIcon, Center, SegmentedControl } from "@mantine/core";

import { EventType } from "../types";

type Props = {
  eventType: EventType;
  setEventType: (value: EventType) => void;
};

export const ListControls = ({ eventType, setEventType }: Props) => {
  return (
    <Center style={{ position: "relative" }}>
      <SegmentedControl
        value={eventType}
        onChange={(value: EventType) => setEventType(value)}
        data={[
          { label: "Public", value: "public" },
          { label: "I'm invited", value: "invited" },
          { label: "Own Events", value: "own" },
        ]}
      />
      <ActionIcon
        component={Link}
        size="lg"
        variant="outline"
        color="orange"
        href="/events/create"
        title="Add new Event"
        style={{ position: "absolute", top: 3, right: 0 }}
      >
        <MdAdd size={18} />
      </ActionIcon>
    </Center>
  );
};
