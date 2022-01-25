import React, { useCallback, useState } from 'react';
import { Box, Button, Flex, Modal, ModalContent, ModalOverlay, Spacer, Text } from '@chakra-ui/react';
import { distance } from 'src/utils/eta';
import usePosition from '@/hooks/usePosition';
import { Eta, Event, EventUser, EventUserState, Position } from '@/interfaces';
// import { MemoizedEventPageScheduleTimer } from '../EventPageSchedule';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { endEvent, selectEta, transitionEventUserState } from './redux';
import Card from '@/components/Card';
import { MemoizedEventPageScheduleTimer } from './EventScheduler';


const METERS_TO_MILES_CONVERSION = 0.000621371;
const DEFAULT_ACCURACY_BUFFER_METERS = 200;

const getIsAtDestination = (
  position: Position,
  destination: Position,
  accuracyBufferMeters: number = 200,
): boolean => distance(position, destination) < accuracyBufferMeters * METERS_TO_MILES_CONVERSION;


function RecommendationSchedule({ event, eta }: { event: Event, eta: Eta | null }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const hideModal = useCallback(() => setShowModal(false), []);
  return (
    <Card p={'1rem'}>
      <Flex align={'center'}>
        <Text>Set up a meetup time</Text>
        <Spacer />
        <Button
          onClick={() => setShowModal(true)}
          colorScheme='blue'
        >
          Schedule
        </Button>
        <Modal
          isCentered
          variant={'light'}
          isOpen={showModal}
          onClose={hideModal}
        >
          <ModalOverlay />
          <ModalContent>
            <MemoizedEventPageScheduleTimer
              eventId={event.eventId}
              scheduledForMs={event.scheduledForMs}
              eta={eta}
              onSchedule={hideModal}
            />
          </ModalContent>
        </Modal>
      </Flex>
    </Card>
  );
}

function RecommendationArrive({ event }: { event: Event }) {
  /**
   * Handle business logic of whether user can Arrive
   */
  const { position, accuracy: accuracyMeters } = usePosition();
  const atDestination = position ? getIsAtDestination(
    position,
    event.place.position,
    accuracyMeters ? accuracyMeters + 100 : DEFAULT_ACCURACY_BUFFER_METERS
  ) : false;

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  async function handleClick() {
    setLoading(true);
    await dispatch(transitionEventUserState({
      eventId: event.eventId,
      nextState: EventUserState.arrived,
      position
    }));
    setLoading(false);
  }

  const disabled = !atDestination || loading;
  return (
    <Card p={'1rem'}>
      <Flex align={'center'}>
        <Text>{atDestination ? 'You\'ve made it! Please mark your arrival.' : 'Get closer to the destination.'}</Text>
        <Spacer />
        <Button
          disabled={disabled}
          onClick={handleClick}
          colorScheme='blue'
        >
          Arrive
        </Button>
      </Flex>
    </Card>
  );
}

function RecommendationDepart({ event, eta }: { event: Event, eta: Eta | null }) {
  /**
   * Handle business logic of whether user can Depart
   */
  const { position } = usePosition();

  const departureInMinutes = (() => {
    if (!eta || !event.scheduledForMs) {
      return null;
    }
    const etaMs = eta.recordedAtMs + eta.durationMs;
    return Math.floor((event.scheduledForMs - etaMs) / 1000 / 60);
  })();

  const text = (() => {
    if (departureInMinutes === null || departureInMinutes === 0) {
      return "Depart now!";
    } else if (departureInMinutes < 0) {
      const lateMinutes = Math.abs(departureInMinutes);
      if (lateMinutes === 1) {
        return 'Depart now, you\'re running 1 minute late.';
      }
      return `Depart now, you're running ${lateMinutes} minutes late!`;
    } else {
      return `Depart in ${departureInMinutes} minutes`;
    }
  })();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  async function handleTransition(nextState: EventUserState) {
    setLoading(true);
    await dispatch(transitionEventUserState({
      eventId: event.eventId,
      nextState,
      position,
    }));
    setLoading(false);
  }

  return (
    <>
      <div>{text}</div>
      <Button disabled={loading} onClick={() => handleTransition(EventUserState.departed)}>
        Depart
      </Button>
    </>
  );
}


function RecommendationEnd({ me, event }: { me: EventUser | null, event: Event }) {
  /**
   * Handle business logic of whether user can End the event
   */
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  async function handleClick() {
    setLoading(true);
    await dispatch(endEvent(event.eventId));
  }

  const hasEveryoneArrived = event.eventUsers.reduce((hasEveryoneArrived, eventUser) => {
    return hasEveryoneArrived && !!eventUser.states.arrived;
  }, true);

  return (
    <>
      <div>{hasEveryoneArrived ? 'End event to view stats' : 'Not everyone has arrived'}</div>
      <Button disabled={!hasEveryoneArrived || loading} onClick={handleClick}>
        End
      </Button>
    </>
  );
}

type EventPageRecommendationProps = {
  event: Event;
  me: EventUser | null;
};

export default function EventPageRecommendation({ event, me }: EventPageRecommendationProps) {
  const eta: Eta | null = useAppSelector(selectEta) || null;

  if (!me) {
    return null;
  }

  return (
    <Box bg="dark">
      {(() => {
        if (event.createdByUserPhoneNumber === me.phoneNumber && !event.scheduledForMs) {
          return <RecommendationSchedule event={event} eta={eta} />;
        }

        switch (me.states.next) {
          case EventUserState.departed: {
            return <RecommendationDepart event={event} eta={eta} />
          }
          case EventUserState.arrived: {
            return <RecommendationArrive event={event} />;
          }
        }

        if (me.states.current === EventUserState.arrived) {
          return <RecommendationEnd me={me} event={event} />;
        }
      })()}
    </Box>
  )
}
