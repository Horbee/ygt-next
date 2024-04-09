import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { MantineProvider } from "@mantine/core";

import { AppLoader } from "../components/loaders";
import { api } from "../utils/api";

import type { Session } from "next-auth";
import type { AppType } from "next/app";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MantineProvider>
      <SessionProvider session={session}>
        <AppLoader>
          <Component {...pageProps} />
        </AppLoader>
      </SessionProvider>
      <ToastContainer position="bottom-center" theme="colored" autoClose={8000} />
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
