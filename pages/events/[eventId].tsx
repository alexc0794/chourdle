import { fetchEvent } from "src/event/redux";
import { wrapper } from "src/store";


const Event = () => {
  return (
    <div>
      Event
    </div>
  )
}

Event.getInitialProps = wrapper.getInitialPageProps(
  ({ dispatch }) => async ({ query }) => {
    const eventId = typeof query.eventId === 'string' ? query.eventId : null;
    if (!eventId) return;
    return await dispatch(fetchEvent(eventId));
  }
)

export default Event;