import { Card, Grid, Group, Skeleton, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  count: number;
}

export const EventCardSkeleton = ({ count }: Props) => {
  const xsScreen = useMediaQuery("(max-width: 576px)");

  const list = Array.from(Array(count).keys());

  return (
    <>
      {list.map((k) => (
        <Card key={k} shadow="sm" p="sm" radius="md" withBorder>
          <Card.Section>
            <Grid>
              <Grid.Col span={{ xs: 3 }} p={0} m={0}>
                <Skeleton height={xsScreen ? 180 : 135} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 9 }}>
                <Stack p="xs">
                  <Group justify="space-between">
                    <Skeleton height={20} width={150} />
                    {!xsScreen && <Skeleton height={20} width={150} />}
                  </Group>

                  {xsScreen && <Skeleton height={20} />}

                  <Skeleton height={23} width={280} />

                  <Skeleton height={15} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card.Section>
        </Card>
      ))}
    </>
  );
};
