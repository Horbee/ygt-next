import { Badge, Flex, ScrollArea, ScrollAreaProps } from "@mantine/core"

interface Props extends ScrollAreaProps {
  tags: string[];
}

export const ScrollableTagList = ({ tags, style, ...restProps }: Props) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ScrollArea
      style={{
        height: "30px",
        cursor: "grab",
        overflow: "auto",
        ...style,
      }}
      offsetScrollbars
      scrollbarSize={5}
      {...restProps}
    >
      <Flex wrap="nowrap" gap="xs">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" color="orange">
            {tag}
          </Badge>
        ))}
      </Flex>
    </ScrollArea>
  );
};
