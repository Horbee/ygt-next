import { ReactNode } from "react";

import { BackgroundImage } from "@mantine/core";

export const WithBackgroundImage = ({
  imgSrc,
  children,
}: {
  imgSrc?: string;
  children: ReactNode;
}) => {
  return (
    <>
      {imgSrc ? (
        <BackgroundImage src={imgSrc} radius="sm">
          {children}
        </BackgroundImage>
      ) : (
        children
      )}
    </>
  );
};
