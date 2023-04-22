import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdMail } from "react-icons/io";

import { Button, Stack, TextInput } from "@mantine/core";

type MagicLinkFormValues = {
  email: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailSigninForm = () => {
  const { formState, handleSubmit, register } = useForm<MagicLinkFormValues>();

  const sendMagicLink: SubmitHandler<MagicLinkFormValues> = async ({ email }) => {
    await signIn("email", { email });
  };

  return (
    <form onSubmit={handleSubmit(sendMagicLink)}>
      <Stack>
        <TextInput
          mt="md"
          label="Email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: emailRegex,
              message: "Please provide a valid Email address",
            },
          })}
          error={formState.errors.email?.message}
        />

        <Button
          color="blue"
          type="submit"
          fullWidth
          leftIcon={<IoMdMail size={18} />}
          disabled={formState.isSubmitting}
        >
          Send a magic link
        </Button>
      </Stack>
    </form>
  );
};
