import { useAppSelector } from "@/hooks/useRedux";
import { fetchEvent, selectEvent } from "src/event/redux";
import { wrapper } from "src/store";
import { Event } from "@/interfaces";
import EventHeader from "src/event/EventHeader";


const EventPage = () => {
  const event: Event | null = useAppSelector(selectEvent);
  return (
    <div>
      {event ? (
        <EventHeader event={event} me={null} isEditable />
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