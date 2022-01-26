import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Center, Heading, Spinner, Stack } from "@chakra-ui/react";
import { fetchEndedEvents, selectEndedEvents } from "./redux";
import Card from "@/components/Card";
import { getFormattedDate, getFormattedTime } from "src/utils/eta";


export default function EventHistory() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector(selectEndedEvents);

  useEffect(() => {
    async function load() {
      await dispatch(fetchEndedEvents());
    }
    load();
  }, [dispatch]);

  if (loading) {
    return (
      <Center p={'2rem'}>
        <Spinner />
      </Center>
    )
  }

  if (!events || !events.length) {
    return null;
  }

  return (
    <Stack p={'0.5rem'}>
      {events.map(event => (
        <Link key={event.eventId} href={`/events/${event.eventId}`}>
          <Card>
            <Heading variant={'lg'}>{event.eventName}</Heading>
            {event.endedAtMs && (
              <Heading variant={'md'}>
                {getFormattedDate(event.endedAtMs)} {getFormattedTime(event.endedAtMs)}
              </Heading>
            )}
          </Card>
        </Link>
      ))}
    </Stack>
  );
}
