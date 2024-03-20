import { CloseButton, Group, Image, Title } from "@mantine/core";

import type { GroupProps } from "@mantine/core";

interface Props extends GroupProps {
  onClose: () => void;
}

export const NavHeader = ({ onClose, ...props }: Props) => {
  return (
    <Group position="apart" {...props}>
      <Group>
        <Image src="/favicon-32x32.png" width={20} />
        <Title order={4}>YGT</Title>
      </Group>
      <CloseButton title="Close popover" size="md" onClick={onClose} />
    </Group>
  );
};
