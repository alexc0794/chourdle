import React from 'react';
import { Event, EventUser } from '@/interfaces';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import InviteAction from '../actions/InviteAction';


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
    <ButtonGroup
      display={'flex'}
      flexDirection={'row'}
      padding={'1rem 0'}
      justifyContent={'space-evenly'}
      grow={1}
      size={'sm'}
    >
      {phoneNumbers.length > 1 && (
        <Button
          variant={'outline'}
          onClick={handleTextClick}
          colorScheme={'blue'}
          leftIcon={<ChatIcon />}
        >
          Text All
        </Button>
      )}
    </ButtonGroup>
  );
}
