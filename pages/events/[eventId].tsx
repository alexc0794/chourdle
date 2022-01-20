import { Divider, Stack, useInterval } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchEvent, selectEvent, selectMe } from "src/event/redux";
// import { wrapper } from "src/store";
import { Event, EventUser } from "@/interfaces";
import EventHeader from "src/event/EventHeader";
import EventTransportMode from "src/event/EventTransportMode";
import { useEffect } from "react";
import { selectToken } from "src/session/redux";
import { IS_DEV } from "@/config";
import { useRouter } from "next/router";
import EventRecommendation from "src/event/EventRecommendation";
import EventPageSchedule from "src/event/EventScheduler";


const EVENT_REFRESH_RATE_MS = IS_DEV ? 5000 : 60000;

const EventPage = () => {
  const { query } = useRouter();
  const eventId = query.eventId as string || null;
  const event: Event | null = useAppSelector(selectEvent);
  const me: EventUser | null = useAppSelector(selectMe);
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();
  const load = async (eventId: string | null) => {
    if (eventId) await dispatch(fetchEvent(eventId));
  }

  useEffect(() => { load(eventId); }, [token, eventId]);
  useInterval(() => load(eventId), EVENT_REFRESH_RATE_MS);

  return (
    <div>
      {event ? (
        <>
          <EventHeader event={event} me={me} isEditable />
          <Divider borderColor={'background.dark'} />
          {me && (
            <Stack spacing={3}>
              <EventPageSchedule event={event} me={me} />
              <EventTransportMode
                eventId={event.eventId}
                transportMode={me.transportMode}
                googlePlaceId={event.place.googlePlaceId}
              />
              <EventRecommendation event={event} me={me} />
            </Stack>
          )}
        </>
      ) : null}
    </div>
  );
};

// EventPage.getInitialProps = wrapper.getInitialPageProps(
//   ({ dispatch }) => async ({ query }) => {
//     const eventId = typeof query.eventId === 'string' ? query.eventId : null;
//     if (!eventId) return;
//     return await dispatch(fetchEvent(eventId));
//   }
// );

export default EventPage;