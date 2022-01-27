import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Event, EventUser } from "@/interfaces";
import { Button, ButtonGroup, Heading, Stack, useInterval } from "@chakra-ui/react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectPhoneNumber, selectToken } from "src/session/redux";
import { getPayouts } from "./api";
import { selectMe } from "./redux";
import { sortEventUsers } from "./utils";
import Link from "next/link";


function getPlaceSuffix(n: number): string {
  switch (n) {
    case 11:
      return "th";
    case 12:
      return "th";
    case 13:
      return "th";
  }

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

type EventPageEndedProps = {
  event: Event
}

export default function EventPageEnded({ event }: EventPageEndedProps) {
  const fireConfetti = () => {
    const canvas = document.getElementById('EventPageEnded-canvas');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return;
    }
    confetti.create(canvas, { resize: false })({
      spread: 90,
      startVelocity: 35,
      scalar: 0.8,
      origin: { y: 1.1 }
    });
  };

  useEffect(fireConfetti, []);
  useInterval(fireConfetti, 5000);

  const [payouts, setPayouts] = useState<{ [phoneNumber: string]: number }>({});
  const token = useAppSelector(selectToken);
  const phoneNumber = useAppSelector(selectPhoneNumber);

  useEffect(() => {
    async function fetchPayouts(eventId: string, token: string) {
      setPayouts(await getPayouts(eventId, token));
    }
    if (token) {
      fetchPayouts(event.eventId, token);
    }
  }, [event.eventId, token]);

  const me: EventUser | null = useAppSelector(selectMe);
  const eventUsers = [...event.eventUsers];
  eventUsers.sort(sortEventUsers);
  const ranking = eventUsers.findIndex(eventUser => eventUser.phoneNumber === me?.phoneNumber) + 1; // Start index from 1

  // Find earliest departure
  const startMs = eventUsers.reduce(
    (earliestDepartureMs, eventUser) =>
      eventUser.states.departed && eventUser.states.departed.timestampMs < earliestDepartureMs ? eventUser.states.departed.timestampMs : earliestDepartureMs,
    new Date().getTime()
  );
  // Find latest arrival
  const endMs = eventUsers.reduce(
    (latestArrivalMs, eventUser) =>
      eventUser.states.arrived && eventUser.states.arrived.timestampMs > latestArrivalMs ? eventUser.states.arrived.timestampMs : latestArrivalMs,
    0
  );

  return (
    <Stack p={'1rem'}>
      <Stack align={'center'}>
        <canvas
          id="EventPageEnded-canvas"
          style={{
            position: 'absolute',
            height: '100px',
            width: '90%'
          }}
        />
        <Heading variant={'lg'}>
          You came in
        </Heading>
        <Heading>{`${ranking}${getPlaceSuffix(ranking)}`}</Heading>
      </Stack>
      {eventUsers.map(eventUser => (
        <EventUserRow
          key={eventUser.phoneNumber}
          eventUser={eventUser}
          startMs={startMs}
          endMs={endMs}
          scheduledForMs={event.scheduledForMs}
          payoutDollars={payouts[eventUser.phoneNumber] || null}
          showActions={eventUser.phoneNumber !== phoneNumber}
        />
      ))}
    </Stack>
  );
}

type EventUserRowProps = {
  eventUser: EventUser;
  startMs: number;
  endMs: number;
  scheduledForMs: number | null;
  payoutDollars: number | null;
  showActions: boolean;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

function EventUserRow({ eventUser, startMs, endMs, scheduledForMs, payoutDollars, showActions }: EventUserRowProps) {
  const message = (() => {
    if (!eventUser.states.arrived) {
      return null;
    }

    if (scheduledForMs) {
      const lateMs = eventUser.states.arrived.timestampMs - scheduledForMs;
      if (lateMs > 0) {
        return ` arrived ${Math.round(lateMs / 1000 / 60)} min late`;
      } else {
        return ` arrived ${Math.round(-1 * lateMs / 1000 / 60)} min early`;
      }
    }
  })();
  return (
    <Stack p={'1rem'}>
      <Heading variant={'lg'}>
        {eventUser.name} {message}
      </Heading>
      {showActions && (
        <ButtonGroup p={'1rem 0 0'}>
          {payoutDollars && payoutDollars < 0 && (
            <Link href={`https://venmo.com/${eventUser.phoneNumber}?txn=pay&amount=${Math.abs(payoutDollars)}`}>
              <Button
                size="sm"
                variant={'danger'}
              >
                {`Pay ${formatter.format(Math.abs(payoutDollars))}`}
              </Button>
            </Link>
          )}
          {payoutDollars && payoutDollars > 0 && (
            <Link href={`https://venmo.com/${eventUser.phoneNumber}?txn=charge&amount=${Math.abs(payoutDollars)}`}>
              <Button size="sm">
                {`Request ${formatter.format(Math.abs(payoutDollars))}`}
              </Button>
            </Link>
          )}
        </ButtonGroup>
      )}
    </Stack>
  );
}
