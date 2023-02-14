import { ReactNode } from "react";

interface Props {
  loading: boolean;
  loader: ReactNode;
  children: ReactNode;
}

export const LoadingWrapper = ({ loading, loader, children }: Props) => {
  return <>{loading ? loader : children}</>;
};
