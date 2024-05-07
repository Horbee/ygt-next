import { Avatar, Text, ActionIcon, TextInput, Stack, Button, Group } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";

import type { GetServerSideProps } from "next";

import { BaseLayout } from "../../components/BaseLayout";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { withAuthentication } from "../../utils/withAuthentication";
import { AttachmentSelector } from "../../components/attachment-selector/AttachmentSelector";
import { useDisclosure } from "@mantine/hooks";
import { Trash } from "lucide-react";

type UserFormValues = {
  username: string;
  image?: string | null;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

export default function UserPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [attachmentSelectorOpen, { open, close }] = useDisclosure();
  const { formState, handleSubmit, register, setValue, watch } = useForm<UserFormValues>({
    defaultValues: { username: session?.user.name ?? "", image: session?.user.image },
  });
  const updateUser = api.user.updateUserData.useMutation();

  const updateUserData: SubmitHandler<UserFormValues> = async (values) => {
    try {
      await toast.promise(updateUser.mutateAsync(values), {
        pending: "Updating user...",
        success: "User updated 👌",
        error: "Error while updating user 🤯",
      });
      await updateSession({ name: values.username, image: values.image });
      router.push("/events");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BaseLayout title="User Settings">
      <AttachmentSelector
        opened={attachmentSelectorOpen}
        closeSelector={close}
        onSelect={(attachment) => {
          setValue("image", attachment.url);
          close();
        }}
      />
      <Stack>
        <Group style={{ alignSelf: "center" }} align="flex-start">
          <Avatar
            src={watch("image")}
            alt="user avatar"
            size={128}
            onClick={open}
            style={{ cursor: "pointer" }}
            styles={{ image: { objectFit: "contain" } }}
          />
          <ActionIcon
            onClick={() => setValue("image", null)}
            color="red"
            variant="outline"
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
        <form onSubmit={handleSubmit(updateUserData)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Please enter a valid username"
              {...register("username", {
                required: "Username is required",
              })}
              error={formState.errors.username?.message}
              withAsterisk
            />
            <Text color="dimmed" size="md">
              Email: {session?.user.email}
            </Text>

            <Button color="orange" type="submit">
              Save
            </Button>
          </Stack>
        </form>
      </Stack>
    </BaseLayout>
  );
}
