import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Attachment } from "@prisma/client";

import { BaseLayout } from "../../../components/BaseLayout";
import { EventForm } from "../../../components/event-form/EventForm";
import { useAuthenticatedRedirect } from "../../../hooks";
import { mapToCreateEventDto } from "../../../mappers";
import { EventFormValues } from "../../../types";
import { api } from "../../../utils/api";

const EditEventPage: NextPage = () => {
  useAuthenticatedRedirect("/login");
  const router = useRouter();

  const slug = router.query.slug as string;

  const eventQuery = api.event.getEventBySlug.useQuery(
    { slug },
    { enabled: !!slug, cacheTime: 0 }
  );
  const update = api.event.updateEvent.useMutation();

  const event = eventQuery.data;

  const editEvent = async (values: EventFormValues, attachment: Attachment | null) => {
    try {
      const edited = await toast.promise(
        update.mutateAsync({
          eventId: event!.id,
          eventDto: mapToCreateEventDto(values, attachment?.id),
        }),
        {
          pending: "Saving...",
          success: "Event saved 👌",
          error: "Event can not be saved 🤯",
        }
      );

      router.push("/events/" + edited.slug);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BaseLayout title="Edit Event">
      {event && (
        <EventForm
          submitButtonText="Edit"
          submitCallback={editEvent}
          selectedEvent={event}
          keepSlugValue
        />
      )}
    </BaseLayout>
  );
};

export default EditEventPage;
