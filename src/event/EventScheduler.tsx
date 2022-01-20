import { memo, useState, useCallback } from "react";
import { Button, ButtonGroup, Center, Heading, Menu, MenuButton, MenuItem, MenuList, Modal, ModalContent, ModalOverlay, Stack, Switch } from "@chakra-ui/react";
import { Event, EventUser, Eta, TransportMode } from "@/interfaces";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { scheduleEvent, selectEta } from "./redux";
import { getFormattedDate, getFormattedTime } from "src/utils/eta";


type EventPageScheduleProps = {
  event: Event;
  me: EventUser | null;
};

export default function EventPageSchedule({ event, me }: EventPageScheduleProps) {
  const eta: Eta | null = useAppSelector(selectEta) || null;
  const transportMode: TransportMode | null = me ? me.transportMode : null;
  const timeMs = eta ? eta.durationMs + eta.recordedAtMs : null;
  const loading = eta === null && transportMode !== null;

  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const openModal = useCallback(() => setShowScheduleModal(true), []);
  const closeModal = useCallback(() => setShowScheduleModal(false), []);

  return (
    <div className="EventPageSchedule">
      <div className="EventPageScheduleItem">
        <h3 className="EventPageScheduleItem-title">Your Projected Arrival</h3>
        {!timeMs && loading && (
          <div className="EventPageScheduleItem-spinner">
            Loading
          </div>
        )}
        {!loading &&
          (timeMs ? (
            <>
              <p className="EventPageScheduleItem-date">
                {getFormattedDate(timeMs)}
              </p>
              <p className="EventPageScheduleItem-time">
                {getFormattedTime(timeMs)}
              </p>
            </>
          ) : (
            <>
              <p className="EventPageScheduleItem-date">--</p>
            </>
          ))}
      </div>
      <div
        className="EventPageScheduleItem"
        onClick={openModal}
        role="link"
        tabIndex={0}
        aria-label="Edit the scheduled time"
      >
        <h3 className="EventPageScheduleItem-title">Scheduled</h3>
        {(() => {
          if (event.scheduledForMs) {
            return (
              <>
                <p className="EventPageScheduleItem-date">
                  {getFormattedDate(event.scheduledForMs)}
                </p>
                <p className="EventPageScheduleItem-time">
                  {getFormattedTime(event.scheduledForMs)}
                </p>
              </>
            );
          } else {
            return null;
          }
        })()}
      </div>
      <Modal
        isOpen={showScheduleModal}
        onClose={closeModal}
        variant="light"
      >
        <ModalOverlay />
        <ModalContent>
          <MemoizedEventPageScheduleTimer
            eventId={event.eventId}
            scheduledForMs={event.scheduledForMs}
            eta={eta}
            onSchedule={closeModal}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}


type EventPageScheduleTimerProps = {
  eventId: string;
  scheduledForMs: number | null;
  eta: Eta | null;
  onSchedule: () => void;
};

function EventPageScheduleTimer({ eventId, scheduledForMs, eta, onSchedule }: EventPageScheduleTimerProps) {
  const dispatch = useAppDispatch();

  const defaultScheduledForDate = (() => {
    if (scheduledForMs) {
      return new Date(scheduledForMs);
    }

    if (eta) {
      const projectedArrivalMs = eta.durationMs + eta.recordedAtMs;
      return new Date(Math.max(Date.now(), projectedArrivalMs));
    }

    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    return date;
  })();

  const [hour, setHour] = useState<number>(defaultScheduledForDate.getHours() % 12);
  const [minutes, setMinutes] = useState<number>(defaultScheduledForDate.getMinutes());
  const [meridian, setMeridian] = useState<'AM' | 'PM'>(defaultScheduledForDate.getHours() < 12 ? 'AM' : 'PM');
  const [day, setDay] = useState<number>(defaultScheduledForDate.getDay());

  const getDate = () => {
    const now = new Date();
    let diffDay = day - now.getDay();
    diffDay = diffDay < 0 ? 7 + diffDay : diffDay;
    now.setDate(now.getDate() + diffDay);
    now.setHours(hour + (meridian === "PM" ? 12 : 0));
    now.setMinutes(minutes);
    return now;
  }

  const formatDate = (date: Date) => date.toLocaleDateString("en-US", {
    weekday: 'short', month: 'numeric', day: 'numeric', hour: "numeric", minute: "2-digit",
  });

  const formatMinutes = (minutes: number) => minutes < 10 ? `0${minutes}` : minutes;

  const getHeader = () => {
    if (scheduledForMs) {
      return `This event is scheduled for ${formatDate(new Date(scheduledForMs))}.`;
    }
    return 'Event is unscheduled.';
  };

  const getSubmitText = () => {
    return `Schedule for ${formatDate(getDate())}`;
  };

  const handleSchedule = async () => {
    dispatch(scheduleEvent({
      eventId,
      scheduledForMs: getDate().getTime()
    }));
    onSchedule();
  };

  return (
    <Stack p={'1rem'} spacing={4}>
      <Heading size={'md'}>{getHeader()}</Heading>
      <Stack
        display={'flex'}
        direction={'row'}
        justify={'center'}
        align={'center'}
        spacing={3}
      >
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                isActive={isOpen}
                colorScheme={'blue'}
                variant={'outline'}
                size={'lg'}
              >
                {formatMinutes(hour)}
              </MenuButton>
              <MenuList>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(hr => (
                  <MenuItem key={hr} onClick={() => setHour(parseInt(hr, 10))}>{hr}:{formatMinutes(minutes)} {meridian}</MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                isActive={isOpen}
                colorScheme={'blue'}
                variant={'outline'}
                size={'lg'}
              >
                {formatMinutes(minutes)}
              </MenuButton>
              <MenuList>
                {['00', '15', '30', '45'].map(min => (
                  <MenuItem key={min} onClick={() => setMinutes(parseInt(min, 10))}>{hour}:{min} {meridian}</MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>
        <Button onClick={() => setMeridian(meridian === 'AM' ? 'PM' : 'AM')}>
          {meridian === 'AM' ? 'AM' : 'PM'}
        </Button>
      </Stack>
      <ButtonGroup>
        {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((value, i) => (
          <Button
            key={value}
            variant={i === day ? 'primary' : 'outline'}
            disabled={i === day}
            onClick={() => setDay(i)}
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
      <Center>
        <Button onClick={handleSchedule}>{getSubmitText()}</Button>
      </Center>
    </Stack>
  );
}

export const MemoizedEventPageScheduleTimer = memo(EventPageScheduleTimer);
