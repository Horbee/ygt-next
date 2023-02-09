import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { Attachment } from '@prisma/client'

import { BaseLayout } from '../../../components/BaseLayout'
import { EventForm } from '../../../components/event-form/EventForm'
import { useAuthenticatedRedirect } from '../../../hooks'
import { mapToCreateEventDto } from '../../../mappers'
import { EventFormValues } from '../../../types'
import { api } from '../../../utils/api'
import { toBase64 } from '../../../utils/base64'

const EditEventPage: NextPage = () => {
  useAuthenticatedRedirect("/login");
  const router = useRouter();

  const slug = router.query.slug as string;

  const eventQuery = api.event.getEventBySlug.useQuery(
    { slug },
    { enabled: !!slug, cacheTime: 0 }
  );
  const update = api.event.updateEvent.useMutation();
  const upload = api.attachment.uploadImage.useMutation();
  const uploadDelete = api.attachment.deleteImageByPublicId.useMutation();

  const event = eventQuery.data;

  const editEvent = async (values: EventFormValues, image: File | null) => {
    try {
      if (event?.coverImage && (!values.coverImageUrl || image)) {
        // Delete old image
        await toast.promise(
          uploadDelete.mutateAsync(event.coverImage.public_id),
          {
            pending: "Deleting old Image...",
            success: "Image deleted 👌",
            error: "Image can not be deleted 🤯",
          }
        );
      }

      let attachment: Attachment | null = null;
      if (image) {
        const base64 = await toBase64(image);
        attachment = await toast.promise(upload.mutateAsync(base64), {
          pending: "Uploading Image...",
          success: "Image uploaded 👌",
          error: "Image can not be uploaded 🤯",
        });
      }

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
        />
      )}
    </BaseLayout>
  );
};

export default EditEventPage;
