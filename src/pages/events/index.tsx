import { Stack } from '@mantine/core'

import { BaseLayout } from '../../components/BaseLayout'
import { EventCard } from '../../components/EventCard'
import { EventPaginator } from '../../components/EventPaginator'
import { ListControls } from '../../components/ListControls'
import { useEventPagination } from '../../hooks/event-pagination'
import { api } from '../../utils/api'

import type { NextPage } from "next";
const EventListPage: NextPage = () => {
  const { eventType, page, pageSize, setEventType, setPage } =
    useEventPagination();

  const { data } = api.event.getEvents.useQuery({
    type: eventType,
    start: (page - 1) * pageSize,
    size: pageSize,
  });

  return (
    <BaseLayout title="My Event List" showBackButton={false}>
      <Stack>
        <ListControls eventType={eventType} setEventType={setEventType} />

        {data?.content.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}

        <EventPaginator
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          totalCount={data ? data.total : 0}
        />
      </Stack>
    </BaseLayout>
  );
};

export default EventListPage;
