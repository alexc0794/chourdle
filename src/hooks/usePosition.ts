import { useEffect, useRef, useState } from "react";
import { Position } from "../interfaces";


type UsePositionType = {
  position: Position | null;
  accuracy: number | null;
};

type GeolocationType = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

export default function usePosition(): UsePositionType {
  const [geolocation, setGeolocation] = useState<GeolocationType | null>(null);

  let mountedRef = useRef<boolean>(true);
  let watchRef = useRef<number>();

  function onPositionEvent(e: any) {
    if (!mountedRef.current) {
      return;
    }

    setGeolocation({
      latitude: e.coords.latitude,
      longitude: e.coords.longitude,
      accuracy: e.coords.accuracy, // in meters
      timestamp: e.timestamp,
    });
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    if (watchRef.current) {
      navigator.geolocation.clearWatch(watchRef.current);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(onPositionEvent);
    if (!watchRef.current) {
      watchRef.current = navigator.geolocation.watchPosition(
        onPositionEvent,
        (error) => console.error(error.code, error.message),
        {
          maximumAge: 30 * 1000,
          enableHighAccuracy: false,
        }
      );
    }

    return () => {
      mountedRef.current = false;
      if (watchRef.current) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []);

  const position: Position | null = geolocation ? {
    latitude: geolocation.latitude,
    longitude: geolocation.longitude,
  } : null;
  const accuracy = geolocation ? geolocation.accuracy : null;

  return {
    position,
    accuracy,
  };
}
