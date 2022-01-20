import React from 'react';
import { Event, EventUser } from '@/interfaces';
import { Button, ButtonGroup } from '@chakra-ui/react';
import EventEndAction from './EndAction';


type UserActionsProps = {
  event: Event;
  me: EventUser | null;
};

export default function UserActions({ event, me }: UserActionsProps) {
  const phoneNumbers = event.eventUsers.filter(
    eventUser => eventUser.phoneNumber !== me?.phoneNumber
  ).map(eventUser => eventUser.phoneNumber);

  const handleTextClick = () => {
    const message = 'Sup';
    const eventUrl = `${window.location.origin}/events/${event.eventId}`;
    window.location.href = `sms:&addresses=${phoneNumbers.join(',')
      }&body=${encodeURIComponent(
        `${message}\n\n${eventUrl}`
      )}`;
  };

  return (
    <ButtonGroup>
      {phoneNumbers.length > 1 && (
        <Button onClick={handleTextClick}>
          Text All
        </Button>
      )}
      <EventEndAction event={event} />
    </ButtonGroup>
  );
}
