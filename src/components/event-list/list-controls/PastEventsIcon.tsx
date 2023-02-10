import { CSSProperties } from "react";
import { IoMdTime } from "react-icons/io";

import { ActionIcon, Switch } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  showPast: boolean;
  setShowPast: (value: boolean) => void;
};

export const PastEventsIcon = ({ showPast, setShowPast }: Props) => {
  const style: CSSProperties = { position: "absolute", left: 0 };
  const xsScreen = useMediaQuery("(max-width: 576px)");

  return (
    <>
      {xsScreen ? (
        <ActionIcon
          color="green"
          size="lg"
          variant={showPast ? "outline" : "default"}
          onClick={() => setShowPast(!showPast)}
          style={style}
        >
          <IoMdTime size={18} />
        </ActionIcon>
      ) : (
        <Switch
          label="Past Events"
          style={style}
          checked={showPast}
          onChange={(event) => setShowPast(event.currentTarget.checked)}
        />
      )}
    </>
  );
};
