import { Badge, Flex, ScrollArea, ScrollAreaProps } from "@mantine/core";

interface Props extends ScrollAreaProps {
  tags: string[];
  padLeft?: boolean;
}

export const ScrollableTagList = ({ tags, padLeft = false, style, ...restProps }: Props) => {
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
      <Flex>
        {tags.map((tag, i) => (
          <Badge key={tag} variant="outline" color="orange" style={{ marginLeft: i === 0 ? (padLeft ? "auto" : "0px") : "5px" }}>
            {tag}
          </Badge>
        ))}
      </Flex>
    </ScrollArea>
  );
};
