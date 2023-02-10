import Link from "next/link";
import { MdAdd } from "react-icons/md";

import { ActionIcon, Center, SegmentedControl } from "@mantine/core";

import { EventType } from "../../../types";
import { PastEventsIcon } from "./PastEventsIcon";

type Props = {
  eventType: EventType;
  setEventType: (value: EventType) => void;
  showPast: boolean;
  setShowPast: (value: boolean) => void;
};

export const ListControls = ({
  eventType,
  setEventType,
  showPast,
  setShowPast,
}: Props) => {
  return (
    <Center style={{ position: "relative" }}>
      <PastEventsIcon showPast={showPast} setShowPast={setShowPast} />
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
