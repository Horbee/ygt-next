import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

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
  const imageDelete = api.attachment.deleteAttachment.useMutation();
  const imageCreate = api.attachment.createAttachment.useMutation();

  const event = eventQuery.data;

  const editEvent = async (values: EventFormValues, image: File | null) => {
    try {
      if (event?.coverImage && (!values.coverImageUrl || image)) {
        // Delete old image
        await toast.promise(imageDelete.mutateAsync(event.coverImage.id), {
          pending: "Deleting old Image...",
          success: "Image deleted 👌",
          error: "Image can not be deleted 🤯",
        });
      }

      let coverImageId = event?.coverImageId;
      if (image) {
        const { preSignedUrl, attachment } = await imageCreate.mutateAsync({
          fileName: image.name,
          fileType: image.type,
        });

        const uploadPromise = axios.put(preSignedUrl, image, {
          headers: { "Content-Type": image.type },
        });

        await toast.promise(uploadPromise, {
          pending: "Uploading Image...",
          success: "Image uploaded 👌",
          error: "Image can not be uploaded 🤯",
        });
        coverImageId = attachment.id;
      }

      const edited = await toast.promise(
        update.mutateAsync({
          eventId: event!.id,
          eventDto: mapToCreateEventDto(values, coverImageId),
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
