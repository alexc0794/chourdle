import React from 'react';
import { Event, EventUser } from '@/interfaces';
import { Button, ButtonGroup, Flex } from '@chakra-ui/react';
import EndAction from './EndAction';
import InviteAction from './InviteAction';


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
    <Flex padding={'2rem'} justify={'space-evenly'} align={'center'}>
      {phoneNumbers.length > 1 && (
        <Button onClick={handleTextClick} colorScheme={'blue'}>
          Text All
        </Button>
      )}
      <InviteAction event={event} />
      <EndAction event={event} />
    </Flex>
  );
}
