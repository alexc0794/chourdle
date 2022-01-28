import { Heading } from "@chakra-ui/react";
import { AtSignIcon, CalendarIcon, ChatIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Event, EventUser } from "@/interfaces";
import HeaderNavBar from "@/components/HeaderNavBar";
import { useState } from "react";
import EndAction from "./actions/EndAction";
import InviteAction from "./actions/InviteAction";
import ScheduleAction from "./actions/ScheduleAction";


export default function EventNavBar({
  event,
  me
}: {
  event: Event,
  me: EventUser | null,
}) {
  const [showInviteAction, setShowInviteAction] = useState<boolean>(false);
  const [showScheduleAction, setShowScheduleAction] = useState<boolean>(false);
  const [showEndAction, setShowEndAction] = useState<boolean>(false);

  const handleTextClick = () => {
    const phoneNumbers = event.eventUsers.filter(
      eventUser => eventUser.phoneNumber !== me?.phoneNumber
    ).map(eventUser => eventUser.phoneNumber);

    const message = 'Sup';
    const eventUrl = `${window.location.origin}/events/${event.eventId}`;
    window.location.href = `sms:&addresses=${phoneNumbers.join(',')
      }&body=${encodeURIComponent(
        `${message}\n\n${eventUrl}`
      )}`;
  };

  return (
    <>
      <HeaderNavBar
        title={<Heading variant={'md'}></Heading>}
        icon={<HamburgerIcon />}
        actions={[
          {
            text: 'Text All',
            icon: <ChatIcon mr={'10px'} />,
            onClick: handleTextClick,
          },
          {
            text: 'Schedule',
            icon: <CalendarIcon mr={'10px'} />,
            onClick: () => setShowScheduleAction(true),
          },
          {
            text: 'Invite Guests',
            icon: <AtSignIcon mr={'10px'} />,
            onClick: () => setShowInviteAction(true),
          },
          {
            text: 'End',
            icon: <CloseIcon mr={'10px'} />,
            onClick: () => setShowEndAction(true),
          }
        ]}
      />
      {showEndAction && (
        <EndAction
          eventId={event.eventId}
          onClose={() => setShowEndAction(false)}
        />
      )}
      {showInviteAction && (
        <InviteAction
          event={event}
          onClose={() => setShowInviteAction(false)}
        />
      )}
      {showScheduleAction && (
        <ScheduleAction
          event={event}
          onClose={() => setShowScheduleAction(false)}
        />
      )}
    </>
  );
}
