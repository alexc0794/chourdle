import { useRouter } from "next/router";
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
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Badge, Flex, Heading, IconButton, Spinner, Stack, Text } from "@chakra-ui/react";
import { getTimeUnits } from "src/utils/time";


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
      title: "ARRIVED",
      eventUsers: arrivedEventUsers,
      startRank: 1,
    });
  }

  if (departedEventUsers.length) {
    departedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "DEPARTED",
      eventUsers: departedEventUsers,
      startRank: arrivedEventUsers.length + 1,
    });
  }

  if (joinedEventUsers.length) {
    joinedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "JOINED",
      eventUsers: joinedEventUsers,
      startRank: null,
    });
  }

  if (invitedEventUsers.length) {
    invitedEventUsers.sort(sortEventUsers);
    usersGroupProps.push({
      eventId: event.eventId,
      title: "INVITED ",
      eventUsers: invitedEventUsers,
      startRank: null,
    });
  }

  return (
    <Stack spacing={0} mt={'0.5rem'}>
      {usersGroupProps.map(props => (
        <EventUsersGroup key={props.title}{...props} />
      ))}
    </Stack>
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
    <Stack spacing={0}>
      <Heading
        variant={'sm'}
        p={'0.5rem'}
        textAlign={'center'}
      >
        {title}
      </Heading>
      <Accordion allowMultiple allowToggle>
        <Stack spacing={1}>
          {eventUsers.map((eventUser: EventUser, i: number) => (
            <EventUserCard
              key={eventUser.phoneNumber}
              eventId={eventId}
              eventUser={eventUser}
              ranking={startRank !== null ? startRank + i : null}
            />
          ))}
        </Stack>
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
      const { days, hours, minutes } = getTimeUnits(diffMs);
      if (diffMs > 0) {
        title += ' • ';
        title += (() => {
          const units: string[] = [];
          if (days) {
            units.push(days === 1 ? `1 day` : `${days} days`);
          }
          if (hours) {
            units.push(`${hours} hr`);
          }
          if (minutes) {
            units.push(`${minutes} min`);
          }
          return units.join(' ').trim();
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
    <AccordionItem border={'none'} bg={'background.dark'}>
      <Flex>
        <AccordionButton bg="dark" p={0}>
          <Flex>
            <Stack justify={'center'} align={'center'}>
              {ranking && (
                <Badge m={'0.5rem'} {...(() => {
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
            </Stack>
            <Flex direction={'column'} align={'start'} p={'0.5rem'}>
              <Text fontSize={'12pt'} fontWeight={300}>
                {eventUser.name || eventUser.phoneNumber}{' '}
                {buildEtaTitle(eventUser)}
              </Text>
              <Text fontSize={'10pt'} fontWeight={300} color={'font.lightgray'}>
                {buildEtaDescription(eventUser)}
              </Text>
            </Flex>
          </Flex>
        </AccordionButton>
        {!isMe && <EventUserCardActions eventUser={eventUser} eventId={eventId} />}
      </Flex>
      <AccordionPanel p={'0.5rem'}>
        <Stack spacing={1}>
          {eventUser.states.joined ? (
            <Text>{`${getFormattedTime(eventUser.states.joined.timestampMs)} • Joined`}</Text>
          ) : (
            <Flex align='center'>
              <Spinner size={'sm'} mr={'1rem'} />
              <Text>{' '}Joined</Text>
            </Flex>
          )}
          {eventUser.states.departed ? (
            <Text>{`${getFormattedTime(eventUser.states.departed.timestampMs)} • Departed`}</Text>
          ) : (
            <Flex align='center'>
              <Spinner size={'sm'} mr={'1rem'} />
              <Text>{' '}Departed</Text
              ></Flex>
          )}
          {eventUser.states.arrived ? (
            <Text>{`${getFormattedTime(eventUser.states.arrived.timestampMs)} • Arrived`}</Text>
          ) : (
            <Flex align='center'>
              <Spinner size={'sm'} mr={'1rem'} />
              <Text>{' '}Arrived</Text>
            </Flex>
          )}
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
    <Flex align={'center'}>
      <IconButton
        aria-label='Chat with text message'
        onClick={() => handleMessageClick(eventUser, eventId)}
        disabled={!eventUser.phoneNumber}
        icon={<span>💬</span>}
        size={'md'}
        variant={'primary'}
      />
      <IconButton
        m={0}
        aria-label='View profile'
        onClick={() => push(`/profile/${eventUser.phoneNumber}`)}
        disabled={!eventUser.phoneNumber}
        icon={<span>👤</span>}
        size={'md'}
        variant={'primary'}
      />
    </Flex>
  );
}
