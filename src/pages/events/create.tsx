import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Attachment } from "@prisma/client";

import { BaseLayout } from "../../components/BaseLayout";
import { EventForm } from "../../components/event-form/EventForm";
import { useAuthenticatedRedirect } from "../../hooks";
import { mapToCreateEventDto } from "../../mappers";
import { EventFormValues } from "../../types";
import { api } from "../../utils/api";

const CreateEventPage: NextPage = () => {
  useAuthenticatedRedirect("/login");
  const router = useRouter();

  const create = api.event.createEvent.useMutation();

  const createEvent = async (values: EventFormValues, attachment: Attachment | null) => {
    try {
      const created = await toast.promise(
        create.mutateAsync(mapToCreateEventDto(values, attachment?.id)),
        {
          pending: "Saving...",
          success: "Event saved 👌",
          error: "Event can not be saved 🤯",
        }
      );

      router.push("/events/" + created.slug);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BaseLayout title="Create new Event">
      <EventForm submitButtonText="Create" submitCallback={createEvent} />
    </BaseLayout>
  );
};

export default CreateEventPage;
