import Link from "next/link";
import { useState } from "react";
import { MdAdd } from "react-icons/md";

import { ActionIcon, Chip, DefaultMantineColor, Group, Stack } from "@mantine/core";

import { BaseLayout } from "../../components/BaseLayout";
import { EventCardSkeleton } from "../../components/event-list/content/event-card/EventCardSkeleton";
import { EventCardList } from "../../components/event-list/content/EventCardList";
import { EventPaginator } from "../../components/event-list/content/EventPaginator";
import { LoadingWrapper } from "../../components/LoadingWrapper";
import { useAuthenticatedRedirect } from "../../hooks";
import { useEventPagination } from "../../hooks/event-pagination";
import { EventFilterType } from "../../types";
import { api } from "../../utils/api";

import type { NextPage } from "next";

const eventFilters: {
  title: string;
  value: EventFilterType;
  color?: DefaultMantineColor;
}[] = [
  { title: "Public", value: "public" },
  { title: "I'm invited", value: "invited" },
  { title: "Own events", value: "own" },
  { title: "Inclue past events", value: "past", color: "blue" },
];

const EventListPage: NextPage = () => {
  useAuthenticatedRedirect("/login");

  const { page, pageSize, selectedFilter, setPage, toggleEventFilter } =
    useEventPagination();

  const { data, isLoading } = api.event.getEvents.useQuery({
    eventFilters: selectedFilter,
    start: (page - 1) * pageSize,
    size: pageSize,
  });

  return (
    <BaseLayout
      title="My Event List"
      showBackButton={false}
      actionElement={
        <ActionIcon
          component={Link}
          size="lg"
          variant="outline"
          color="orange"
          href="/events/create"
          title="Add new Event"
        >
          <MdAdd size={18} />
        </ActionIcon>
      }
    >
      <Stack>
        <Group spacing="xs">
          {eventFilters.map(({ title, value, color }) => (
            <Chip
              key={value}
              color={color || "orange"}
              variant="filled"
              checked={selectedFilter.includes(value)}
              onChange={() => toggleEventFilter(value)}
            >
              {title}
            </Chip>
          ))}
        </Group>

        <LoadingWrapper loading={isLoading} loader={<EventCardSkeleton count={3} />}>
          <EventCardList events={data?.content ?? []} />

          <EventPaginator
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            totalCount={data?.total ?? 0}
          />
        </LoadingWrapper>
      </Stack>
    </BaseLayout>
  );
};

export default EventListPage;
