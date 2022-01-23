import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useGoogleMaps from '@/hooks/useGoogleMaps';
import useInterval from '@/hooks/useInterval';
import usePosition from '@/hooks/usePosition';
import { Eta, Event, EventUser, Position, TransportMode } from '@/interfaces';
import { getEta } from 'src/utils/eta';
import { addEventUserEta } from './redux';


type EventTrackerProps = {
  event: Event;
  me: EventUser | null;
};

export default function EventTracker({ event, me }: EventTrackerProps) {
  const dispatch = useDispatch();
  const calculateDistance = useCallback(
    async (
      eventId: string,
      transportMode: TransportMode,
      position: Position,
      googlePlaceId: string
    ) => {
      try {
        const eta: Eta = await getEta(
          transportMode,
          position,
          googlePlaceId
        );
        dispatch(addEventUserEta({ eventId, eta }));
      } catch (error) {
        console.warn(error);
      }
    },
    [dispatch]
  );

  const isGoogleLoaded = useGoogleMaps();
  const transportMode: TransportMode | null = me ? me.transportMode : null;
  const googlePlaceId = event.place.googlePlaceId;
  const { position } = usePosition();
  const latitude = position ? position.latitude : null;
  const longitude = position ? position.longitude : null;

  useEffect(() => {
    if (
      isGoogleLoaded &&
      transportMode !== null &&
      latitude &&
      longitude &&
      googlePlaceId
    ) {
      calculateDistance(event.eventId, transportMode, { latitude, longitude }, googlePlaceId);
    }
  }, [
    event.eventId,
    isGoogleLoaded,
    latitude,
    longitude,
    transportMode,
    googlePlaceId,
    calculateDistance,
  ]);

  useInterval(() => {
    if (
      isGoogleLoaded &&
      transportMode !== null &&
      latitude &&
      longitude &&
      googlePlaceId
    ) {
      calculateDistance(event.eventId, transportMode, { latitude, longitude }, googlePlaceId);
    }
  }, 60 * 1000);


  return <></>;
}