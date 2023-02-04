import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../server/auth";

export const protectedRoute = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
