import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchEvent, selectEvent, selectMe } from "src/event/redux";
import { wrapper } from "src/store";
import { Event, EventUser } from "@/interfaces";
import EventHeader from "src/event/EventHeader";
import EventTransportMode from "src/event/EventTransportMode";
import { useEffect } from "react";
import { selectToken } from "src/session/redux";


const EventPage = () => {
  const event: Event | null = useAppSelector(selectEvent);
  const me: EventUser | null = useAppSelector(selectMe);
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async (eventId: string) => {
      await dispatch(fetchEvent(eventId));
    }
    if (event?.eventId) load(event.eventId);
  }, [token, event?.eventId]);

  return (
    <div>
      {event ? (
        <>
          <EventHeader event={event} me={me} isEditable />
          <EventTransportMode
            eventId={event.eventId}
            transportMode={me?.transportMode || null}
            googlePlaceId={event.place.googlePlaceId}
          />
        </>
      ) : null}
    </div>
  );
};

EventPage.getInitialProps = wrapper.getInitialPageProps(
  ({ dispatch }) => async ({ query }) => {
    const eventId = typeof query.eventId === 'string' ? query.eventId : null;
    if (!eventId) return;
    return await dispatch(fetchEvent(eventId));
  }
);

export default EventPage;