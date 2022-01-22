import { Stack, useInterval } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchEvent, selectEvent, selectMe } from "src/event/redux";
// import { wrapper } from "src/store";
import { Event, EventUser } from "@/interfaces";
import EventHeader, { EventHeaderSkeleton } from "src/event/EventHeader";
import EventTransportMode from "src/event/EventTransportMode";
import { useEffect } from "react";
import { selectToken } from "src/session/redux";
import { IS_DEV } from "@/config";
import { useRouter } from "next/router";
import EventRecommendation from "src/event/EventRecommendation";
import EventPageSchedule from "src/event/EventScheduler";
import EventUsers from "src/event/EventUsers";
import UserActions from "src/event/UserActions";
import NavBar from "@/components/NavBar";


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

  if (eventId !== event?.eventId) {
    return (
      <Stack>
        <EventHeaderSkeleton />
      </Stack>
    );
  }

  return (
    <>
      {event ? (
        <>
          <EventHeader event={event} me={me} isEditable />
          {me && (
            <Stack spacing={1}>
              <EventPageSchedule event={event} me={me} />
              <EventTransportMode
                eventId={event.eventId}
                transportMode={me.transportMode}
                googlePlaceId={event.place.googlePlaceId}
              />
              <EventRecommendation event={event} me={me} />
              <EventUsers event={event} me={me} />
              <UserActions event={event} me={me} />
            </Stack>
          )}
        </>
      ) : null}
      <NavBar />
    </>
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