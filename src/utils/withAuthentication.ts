import { GetServerSidePropsContext, PreviewData } from "next";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";

export async function withAuthentication(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
