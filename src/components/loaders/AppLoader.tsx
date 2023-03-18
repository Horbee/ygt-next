import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

import { SplashScreen } from "./SplashScreen";

import type { ReactNode } from "react";
type Props = {
  children: ReactNode;
};

export const AppLoader = ({ children }: Props) => {
  const { status } = useSession();

  const isLoading = status === "loading";

  return (
    <AnimatePresence mode="wait">
      {isLoading ? <SplashScreen key="splash" /> : children}
    </AnimatePresence>
  );
};
