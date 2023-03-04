import { Suspense, useState } from "react";

import { LoadingOverlay, Stack } from "@mantine/core";

import { BaseLayout } from "../../components/BaseLayout";
import { EventCardSkeleton } from "../../components/event-list/content/event-card/EventCardSkeleton";
import { EventCardList } from "../../components/event-list/content/EventCardList";
import { EventPaginator } from "../../components/event-list/content/EventPaginator";
import { ListControls } from "../../components/event-list/list-controls/ListControls";
import { LoadingWrapper } from "../../components/LoadingWrapper";
import { useAuthenticatedRedirect } from "../../hooks";
import { useEventPagination } from "../../hooks/event-pagination";
import { api } from "../../utils/api";

import type { NextPage } from "next";
const EventListPage: NextPage = () => {
  useAuthenticatedRedirect("/login");

  const [showPast, setShowPast] = useState(false);

  const { eventType, page, pageSize, setEventType, setPage } = useEventPagination();

  const { data, isLoading } = api.event.getEvents.useQuery({
    type: eventType,
    start: (page - 1) * pageSize,
    size: pageSize,
    showPast,
  });

  return (
    <BaseLayout title="My Event List" showBackButton={false}>
      <Stack>
        <ListControls
          eventType={eventType}
          setEventType={setEventType}
          showPast={showPast}
          setShowPast={(value) => {
            setShowPast(value);
            setPage(1);
          }}
        />

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
