import Link from "next/link";

import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { signIn, getProviders } from "next-auth/react";

import { Anchor, Button, Container, Stack } from "@mantine/core";

import { EmailSigninForm } from "../../components/email-signin-form/EmailSigninForm";
import { authOptions } from "../../server/auth";
import { HeadContent } from "../../components/HeadContent";
import { GoogleIcon } from "../../components/brand-icons/GoogleIcon";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: Object.keys(providers ?? {}) },
  };
}

export default function LoginPage({ providers }: { providers: string[] }) {
  return (
    <>
      <HeadContent title="You've got time: Login" />
      <Container size="xs" px="md">
        <Stack h="97vh">
          <h1 style={{ textAlign: "center" }}>Sign into your account</h1>

          <EmailSigninForm />

          <Button
            color="red"
            type="button"
            fullWidth
            leftSection={<GoogleIcon width={18} height={18} />}
            onClick={() => signIn("google")}
            disabled={!providers.includes("google")}
          >
            Sign in with Google
          </Button>

          <div style={{ marginTop: "auto", padding: "10px", textAlign: "center" }}>
            <Anchor component={Link} href="/about">
              About
            </Anchor>
          </div>
        </Stack>
      </Container>
    </>
  );
}
