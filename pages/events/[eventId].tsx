import { useAppSelector } from "@/hooks/useRedux";
import { fetchEvent, selectEvent } from "src/event/redux";
import { wrapper } from "src/store";
import { Event } from "@/interfaces";
import { Heading } from "@chakra-ui/react";


const EventPage = () => {
  const event: Event | null = useAppSelector(selectEvent)
  return (
    <div>
      Event
      {event ? <Heading>{event.eventName}</Heading> : null}
    </div>
  )
}

EventPage.getInitialProps = wrapper.getInitialPageProps(
  ({ dispatch }) => async ({ query }) => {
    const eventId = typeof query.eventId === 'string' ? query.eventId : null;
    if (!eventId) return;
    return await dispatch(fetchEvent(eventId));
  }
)

export default EventPage;