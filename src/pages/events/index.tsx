import { Stack } from '@mantine/core'

import { BaseLayout } from '../../components/BaseLayout'
import { EventCardList } from '../../components/event-list/EventCardList'
import { EventPaginator } from '../../components/EventPaginator'
import { ListControls } from '../../components/ListControls'
import { useAuthenticatedRedirect } from '../../hooks'
import { useEventPagination } from '../../hooks/event-pagination'
import { api } from '../../utils/api'

import type { NextPage } from "next";
const EventListPage: NextPage = () => {
  useAuthenticatedRedirect("/login");

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

        {!!data?.content && <EventCardList events={data.content} />}

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
