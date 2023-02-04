import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Attachment } from "@prisma/client";

import { BaseLayout } from "../../components/BaseLayout";
import { EventForm } from "../../components/event-form/EventForm";
import { mapToCreateEventDto } from "../../mappers";
import { EventFormValues } from "../../types";
import { api } from "../../utils/api";
import { toBase64 } from "../../utils/base64";
import { protectedRoute } from "../../utils/protect";

const CreateEventPage: NextPage = () => {
  const router = useRouter();

  const create = api.event.createEvent.useMutation();
  const upload = api.attachment.uploadImage.useMutation();

  const createEvent = async (values: EventFormValues, image: File | null) => {
    try {
      let attachment: Attachment | null = null;
      if (image) {
        const base64 = await toBase64(image);
        attachment = await toast.promise(upload.mutateAsync(base64), {
          pending: "Uploading Image...",
          success: "Image uploaded 👌",
          error: "Image can not be uploaded 🤯",
        });
      }

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

export const getServerSideProps = protectedRoute;
