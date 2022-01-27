import TransportModeSelector from "@/components/TransportModeSelector";
import { useAppDispatch } from "@/hooks/useRedux";
import { Event, EventUser, TransportMode } from "@/interfaces";
import { Flex } from "@chakra-ui/react";
import { joinEvent } from "./redux";


type EventJoinProps = {
  event: Event;
  me: EventUser | null;
};

export default function EventJoin({ event }: EventJoinProps) {
  const dispatch = useAppDispatch();
  const handleSelect = (transportMode: TransportMode) => {
    dispatch(joinEvent({ eventId: event.eventId, transportMode }));
  }

  return (
    <Flex>
      <TransportModeSelector
        type={'Join'}
        googlePlaceId={event.place.googlePlaceId}
        onSelect={handleSelect}
      />
    </Flex>
  );
}
