import { useEffect } from "react";
import Link from "next/link";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { Event } from "@/interfaces";
import { fetchActiveEvents, selectActiveEvents } from "./redux";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import Card from "@/components/Card";


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
    <Stack>
      <Heading
        size='md'
        color='gray.300'
        fontWeight='400'
      >
        Active
      </Heading>
      {activeEvents.map((event: Event, i: number) => (
        <Link key={event.eventId} href={`/events/${event.eventId}`}>
          <a>
            <Card isShimmering={i === 0}>
              <>
                <Heading size='md'>{event.eventName}</Heading>
                <Text>{buildDescription(nowMs, event)}</Text>
              </>
            </Card>
          </a>
        </Link>
      ))}
    </Stack>
  );
}


function buildDescription(nowMs: number, event: Event): string {
  if (!event.scheduledForMs) {
    return "";
  }
  const diffInMs = nowMs - event.scheduledForMs;
  const diffInMinutes = Math.round(Math.abs(diffInMs) / 1000 / 60);
  if (diffInMs < 0) {
    // Happening in the future
    return `Happening in ${diffInMinutes} minutes`;
  } else {
    return `Scheduled for ${diffInMinutes} minutes ago`;
  }
}