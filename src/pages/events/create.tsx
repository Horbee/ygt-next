import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Attachment } from "@prisma/client";

import { BaseLayout } from "../../components/BaseLayout";
import { EventForm } from "../../components/event-form/EventForm";
import { mapToCreateEventDto } from "../../mappers";
import { EventFormValues } from "../../types";
import { api } from "../../utils/api";
import { withAuthentication } from "../../utils/withAuthentication";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

const CreateEventPage: NextPage = () => {
  const router = useRouter();

  const fromSlug = router.query.from as string;

  const fromEvent = api.event.getEventBySlug.useQuery(
    { slug: fromSlug },
    { enabled: !!fromSlug, cacheTime: 0 }
  );

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
      <EventForm
        key={fromEvent.data?.id}
        submitButtonText="Create"
        submitCallback={createEvent}
        selectedEvent={fromEvent.data}
      />
    </BaseLayout>
  );
};

export default CreateEventPage;
