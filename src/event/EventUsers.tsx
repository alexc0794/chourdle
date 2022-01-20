import { useRouter } from "next/router";
import cx from 'classnames';
import {
  Event,
  EventUser,
  EventUserState,
  TransportMode,
} from "@/interfaces";
import { sortEventUsers } from "./utils";
import { useAppSelector } from "@/hooks/useRedux";
import { selectPhoneNumber } from "src/session/redux";
import { getFormattedTime } from "src/utils/eta";
import UserActions from "./UserActions";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Badge, Button, ButtonGroup, Flex, Heading, IconButton, Spinner, Stack } from "@chakra-ui/react";


const KM_TO_MILES_CONVERSION = 0.621371; // 1 km = 0.621371 miles

type EventUsersProps = {
  event: Event;
  me: EventUser | null;
};

export default function EventUsers({ event, me }: EventUsersProps) {
  const arrivedEventUsers: EventUser[] = [];
  const departedEventUsers: EventUser[] = [];
  const invitedEventUsers: EventUser[] = [];
  const joinedEventUsers: EventUser[] = [];

  event.eventUsers.forEach(eventUser => {
    switch (eventUser.states.current) {
      case EventUserState.arrived:
        arrivedEventUsers.push(eventUser);
        break;
      case EventUserState.departed:
        departedEventUsers.push(eventUser);
        break;
      case EventUserState.invited:
        invitedEventUsers.push(eventUser);
        break;
      default:
        joinedEventUsers.push(eventUser);
    }
  });

  const usersGroupProps: EventUsersGroupProps[] = [];

  if (arrivedEventUsers.length) {
    arrivedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "Arrived",
      eventUsers: arrivedEventUsers,
      startRank: 1,
    });
  }

  if (departedEventUsers.length) {
    departedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "Departed",
      eventUsers: departedEventUsers,
      startRank: arrivedEventUsers.length + 1,
    });
  }

  if (joinedEventUsers.length) {
    joinedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "Joined",
      eventUsers: joinedEventUsers,
      startRank: null,
    });
  }

  if (invitedEventUsers.length) {
    invitedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "Invited",
      eventUsers: invitedEventUsers,
      startRank: null,
    });
  }

  return (
    <div className="EventPageUsers">
      {usersGroupProps.map(props => (
        <EventUsersGroup key={props.title}{...props} />
      ))}
      <UserActions event={event} me={me} />
    </div>
  );
}

type EventUsersGroupProps = {
  eventId: string;
  title: string;
  eventUsers: Array<EventUser>;
  startRank: number | null;
};

function EventUsersGroup({ eventId, title, eventUsers, startRank }: EventUsersGroupProps) {
  return (
    <Stack>
      <Heading size={'sm'} className="EventPageUsers-group-header">{title}</Heading>
      <Accordion
        allowMultiple
        allowToggle
        bg={'background.dark'}
      >
        {eventUsers.map((eventUser: EventUser, i: number) => (
          <EventUserCard
            key={eventUser.phoneNumber}
            eventId={eventId}
            eventUser={eventUser}
            ranking={startRank !== null ? startRank + i : null}
          />
        ))}
      </Accordion>
    </Stack>
  );
}


type EventUserCardProps = {
  eventId: string;
  eventUser: EventUser;
  ranking: number | null;
};

function EventUserCard({ eventId, eventUser, ranking }: EventUserCardProps) {
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const isMe = !!phoneNumber && eventUser.phoneNumber === phoneNumber;

  function buildEtaTitle(eventUser: EventUser): string {
    let title = '';
    if (
      eventUser.states.current === EventUserState.departed &&
      eventUser.states.departed &&
      eventUser.etas.length > 0
    ) {
      const recentEta = eventUser.etas[eventUser.etas.length - 1];
      const diffMs = recentEta.durationMs + recentEta.recordedAtMs - Date.now();
      const diffMin = Math.round(diffMs / 1000 / 60);
      if (diffMin > 0) {
        title += ' • ';
        title += (() => {
          const hoursAgo = Math.floor(diffMin / 60);
          const minutesAgo = diffMin % 60;
          return [
            (hoursAgo ? `${Math.floor(diffMin / 60)} hr` : ''),
            (minutesAgo ? `${diffMin % 60} min` : '')
          ].join(' ').trim()
        })();

        if (recentEta.transportMode !== undefined) {
          title += ` by ${TransportMode[recentEta.transportMode].toLowerCase()}`;
        }
      }
    }
    return title;
  }

  function buildEtaDescription(eventUser: EventUser): string {
    if (eventUser.etas.length === 0) return '';
    let description = "";
    const recentEta = eventUser.etas[eventUser.etas.length - 1];
    const distanceMiles = (recentEta.distanceMeters) / 1000 * KM_TO_MILES_CONVERSION;
    const km = Math.round(distanceMiles * 10) / 10;
    description += `${km} mi`;

    description += ' • ';
    const timeMs = recentEta.durationMs + recentEta.recordedAtMs
    description += getFormattedTime(timeMs);

    description += ' • ';
    const diffMs = Date.now() - recentEta.recordedAtMs;
    const diffMin = Math.round(diffMs / 1000 / 60);

    description += (() => {
      if (diffMin === 0) return 'just now';
      else if (diffMin > 60 * 24) return 'a while ago';
      const hoursAgo = Math.floor(diffMin / 60);
      const minutesAgo = diffMin % 60;
      return [
        (hoursAgo ? `${Math.floor(diffMin / 60)} hr` : ''),
        (minutesAgo ? `${diffMin % 60} min` : '')
      ].join(' ').trim() + ' ago'
    })();

    return description;
  }

  return (
    <AccordionItem>
      <Flex>
        <AccordionButton bg="dark" className="EventPageUsers-card--outer">
          <Flex>
            <div className="EventPageUsers-card-profile">
              {ranking && (
                <Badge {...(() => {
                  switch (ranking) {
                    case 1:
                      return {
                        backgroundColor: '#d6af36 !important',
                        color: 'black',
                      };
                    case 2:
                      return {
                        backgroundColor: '#d7d7d7 !important',
                        color: 'black',
                      };
                    case 3:
                      return {
                        backgroundColor: '#a77044 !important',
                        color: 'black',
                      };
                  }
                })()} >
                  {(() => {
                    switch (ranking) {
                      case 1:
                        return '1st';
                      case 2:
                        return '2nd';
                      case 3:
                        return '3rd';
                      default:
                        return `${ranking}th`;
                    }
                  })()}</Badge>
              )}
            </div>
            <div className="EventPageUsers-card-content">
              <div className="EventPageUsers-card-title">
                {eventUser.name || eventUser.phoneNumber}{' '}<strong>{buildEtaTitle(eventUser)}</strong>
              </div>
              <div className="EventPageUsers-card-description">
                {buildEtaDescription(eventUser)}
              </div>
            </div>
          </Flex>
        </AccordionButton>
        {!isMe && <EventUserCardActions eventUser={eventUser} eventId={eventId} />}
      </Flex>
      <AccordionPanel>
        <Stack>
          <div>
            {eventUser.states.joined ? `${getFormattedTime(eventUser.states.joined.timestampMs)} • ` : <Spinner />}
            {' '}Joined
          </div>
          <div>
            {eventUser.states.departed ? `${getFormattedTime(eventUser.states.departed.timestampMs)} • ` : <Spinner />}
            {' '}Departed
          </div>
          <div>
            {eventUser.states.arrived ? `${getFormattedTime(eventUser.states.arrived.timestampMs)} • ` : <Spinner />}
            {' '}Arrived
          </div>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}

type EventUserCardActionsProps = {
  eventUser: EventUser;
  eventId: string;
};

function EventUserCardActions({ eventUser, eventId }: EventUserCardActionsProps) {
  const { push } = useRouter();

  function handleMessageClick(eventUser: EventUser, eventId: string) {
    if (!eventUser.phoneNumber) {
      return;
    }
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    const message = (() => {
      if (eventUser.states.current === EventUserState.joined) {
        return 'Have you left yet?';
      }
      return 'Where the fook are you?'
    })();

    window.location.href = `sms:${eventUser.phoneNumber
      }  ;?&body=${encodeURIComponent(
        `${message}\n\n${eventUrl}`
      )}`;
  }

  return (
    <ButtonGroup alignItems={'center'}>
      <IconButton
        aria-label='Chat with text message'
        onClick={() => handleMessageClick(eventUser, eventId)}
        disabled={!eventUser.phoneNumber}
        icon={<span>💬</span>}
        size={'sm'}
        variant={'primary'}
      />
      <IconButton
        aria-label='View profile'
        onClick={() => push(`/profile/${eventUser.phoneNumber}`)}
        disabled={!eventUser.phoneNumber}
        icon={<span>👤</span>}
        size={'sm'}
        variant={'primary'}
      />
    </ButtonGroup>
  );
}
