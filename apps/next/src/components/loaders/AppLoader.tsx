import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

import { SplashScreen } from "./SplashScreen";
import { useCreateSubscription } from "../../hooks/useCreateSubscription";

type Props = {
  children: ReactNode;
};

export const AppLoader = ({ children }: Props) => {
  const router = useRouter();
  const { status, data } = useSession();
  const { triggerSubscription } = useCreateSubscription();

  const isLoading = status === "loading";

  useEffect(() => {
    if (
      status === "authenticated" &&
      !data.user.name &&
      router.pathname !== "/users/me"
    ) {
      router.replace("/users/me");
    }
  }, [status, data?.user.name, router]);

  useEffect(() => {
    if (status === "authenticated") {
      triggerSubscription();
    }
  }, [status]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? <SplashScreen key="splash" /> : children}
    </AnimatePresence>
  );
};
