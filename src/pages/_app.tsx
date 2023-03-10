import "react-toastify/dist/ReactToastify.css"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { AppType } from "next/app"
import { ToastContainer } from "react-toastify"

import { AppMantineProvider } from "../context"
import { useCreateSubscription } from "../hooks/useCreateSubscription"
import { api } from "../utils/api"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useCreateSubscription();

  return (
    <AppMantineProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ToastContainer position="bottom-center" theme="colored" autoClose={8000} />
    </AppMantineProvider>
  );
};

export default api.withTRPC(MyApp);
