import Link from "next/link";
import { useRouter } from "next/router";
import {
  BsFileEarmarkBreak,
  BsPencil,
  BsThreeDotsVertical,
  BsTrash,
} from "react-icons/bs";
import { toast } from "react-toastify";

import { ActionIcon, Menu, Portal } from "@mantine/core";

import { api } from "../utils/api";

import type { ActionIconProps } from "@mantine/core";
type Props = ActionIconProps & {
  eventId: string;
  slug: string;
};

export const EventCardMenu = ({ eventId, slug, ...restProps }: Props) => {
  const router = useRouter();
  const utils = api.useContext();

  const deleteEvent = api.event.deleteEvent.useMutation({
    onSuccess: () => {
      utils.event.getEvents.invalidate();
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      try {
        await toast.promise(deleteEvent.mutateAsync(eventId), {
          pending: "Deleting Event...",
          success: "Event deleted 👌",
          error: "Event can not be deleted 🤯",
        });
        router.push("/events");
      } catch (error: any) {
        console.error(error);
        if (error.message) toast.error(error.message);
      }
    }
  };

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon {...restProps}>
          <BsThreeDotsVertical size={18} />
        </ActionIcon>
      </Menu.Target>

      <Portal>
        <Menu.Dropdown>
          <Menu.Label>Owner Actions</Menu.Label>
          <Menu.Item
            component={Link}
            icon={<BsPencil size={14} />}
            href={`/events/${slug}/edit`}
          >
            Edit
          </Menu.Item>
          <Menu.Item
            icon={<BsFileEarmarkBreak size={14} />}
            onClick={() =>
              router.push({ pathname: "/events/create", query: { from: slug } })
            }
          >
            Copy
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<BsTrash size={14} />}
            onClick={() => handleDelete()}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Portal>
    </Menu>
  );
};
