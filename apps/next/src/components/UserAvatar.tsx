import { Avatar, type AvatarProps } from "@mantine/core";

type Props = AvatarProps & {
  image?: string | null;
  name: string;
};

export const UserAvatar = ({ image, name, ...avatarProps }: Props) => {
  return (
    <Avatar src={image} radius="xl" {...avatarProps}>
      {name
        ?.split(" ")
        .map((n) => n[0])
        .join("")}
    </Avatar>
  );
};
