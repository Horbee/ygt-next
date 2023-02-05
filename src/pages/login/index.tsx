import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import { IoLogoGoogle } from 'react-icons/io'

import { Button, Center, Container, Stack } from '@mantine/core'

import { authOptions } from '../../server/auth'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
}

export default function LoginPage() {
  return (
    <>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo512.png" />
        <title>You've got time: Login</title>
      </Head>
      <Container size="xs" px="md">
        <Stack align="center">
          <h1>Sign into your account</h1>

          <Button
            color="red"
            type="button"
            fullWidth
            leftIcon={<IoLogoGoogle size={18} />}
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </Stack>
      </Container>
    </>
  );
}
