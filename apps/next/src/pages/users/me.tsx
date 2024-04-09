import { Avatar, Text, Grid, TextInput, Stack, Button } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";

import type { GetServerSideProps } from "next";

import { BaseLayout } from "../../components/BaseLayout";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { withAuthentication } from "../../utils/withAuthentication";

type UserFormValues = {
  username: string;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return await withAuthentication(context);
};

export default function UserPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { formState, handleSubmit, register } = useForm<UserFormValues>({
    defaultValues: { username: session?.user.name ?? "" },
  });
  const updateUser = api.user.updateUserData.useMutation();

  const updateUsername: SubmitHandler<UserFormValues> = async ({ username }) => {
    try {
      await toast.promise(updateUser.mutateAsync({ username }), {
        pending: "Updating user...",
        success: "User updated 👌",
        error: "Error while updating user 🤯",
      });
      await updateSession({ name: username });
      router.push("/events");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BaseLayout title="User Settings">
      <Grid grow>
        <Grid.Col span={3}>
          <Avatar src={session?.user.image} alt="user avatar" radius="xl" size={128} />
        </Grid.Col>
        <Grid.Col span={9}>
          <form onSubmit={handleSubmit(updateUsername)}>
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
              <Text c="dimmed" size="md">
                Email: {session?.user.email}
              </Text>

              <Button color="orange" type="submit">
                Save
              </Button>
            </Stack>
          </form>
        </Grid.Col>
      </Grid>
    </BaseLayout>
  );
}
