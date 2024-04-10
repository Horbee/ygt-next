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
        <BackgroundImage
          src={imgSrc}
          radius="sm"
          data-testid="background-img"
          style={{ backgroundSize: "contain", backgroundRepeat: "no-repeat" }}
        >
          {children}
        </BackgroundImage>
      ) : (
        children
      )}
    </>
  );
};
