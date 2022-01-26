import { useEffect } from "react";
import Link from "next/link";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { Event } from "@/interfaces";
import { fetchActiveEvents, selectActiveEvents } from "./redux";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import Card from "@/components/Card";
import { getTimeUnits } from "src/utils/time";


export default function ActiveEvents() {
  const dispatch = useAppDispatch();
  const activeEvents = useAppSelector(selectActiveEvents);

  useEffect(() => {
    async function loadActiveEvent() {
      await dispatch(fetchActiveEvents());
    }
    loadActiveEvent();
  }, [dispatch]);

  if (!activeEvents.length) {
    return null;
  }

  const nowMs = new Date().getTime();

  return (
    <Stack p={'0 0.5rem'} spacing={2}>
      <Heading variant={'md'}>
        Active
      </Heading>
      {activeEvents.map((event: Event, i: number) => (
        <Link key={event.eventId} href={`/events/${event.eventId}`}>
          <a>
            <Card isShimmering={i === 0}>
              <Heading variant={'lg'}>{event.eventName}</Heading>
              <Text>{buildDescription(nowMs, event)}</Text>
            </Card>
          </a>
        </Link>
      ))}
    </Stack>
  );
}


function buildDescription(nowMs: number, event: Event): string {
  if (!event.scheduledForMs) return '';

  const diffInMs = nowMs - event.scheduledForMs;
  const { days, hours, minutes } = getTimeUnits(diffInMs);
  const timeUnits = (() => {
    if (days)
      return days === 1 ? `1 day` : `${days} days`;
    else if (hours)
      return hours === 1 ? `1 hour` : `${hours} hours`;
    else if (minutes)
      return minutes === 1 ? `1 minute` : `${minutes} minutes`;
    else {
      return 'a few seconds';
    }
  })();
  if (diffInMs < 0) {
    // Happening in the future
    return `Happening in ${timeUnits}`;
  } else {
    return `Scheduled for ${timeUnits} ago`;
  }
}