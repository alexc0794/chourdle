import { useEffect, useState } from "react";
import { getEta } from "src/utils/eta";
import { Eta, Position, TransportMode } from "@/interfaces";
import useGoogleMaps from "./useGoogleMaps";
import usePosition from "./usePosition";


const DISTANCE_CACHE_BUSTER_MS = 1000 * 60; // 1 minute

type Cache = {
  [key: string]: Eta
};

export default function useTransportMode(transportMode: TransportMode | null, googlePlaceId: string | null) {
  const { position } = usePosition();
  const isGoogleLoaded = useGoogleMaps();
  const [cache, setCache] = useState<Cache>({});
  const currentCacheKey = `${transportMode}|${googlePlaceId}|${position?.latitude},${position?.longitude}`;

  useEffect(() => {
    async function calculateDistance(
      transportMode: TransportMode,
      position: Position,
      googlePlaceId: string
    ) {
      const eta: Eta = await getEta(
        transportMode,
        position,
        googlePlaceId
      );
      setCache({
        ...cache,
        [currentCacheKey]: eta
      });
    }

    if (currentCacheKey in cache && Date.now() - cache[currentCacheKey].recordedAtMs < DISTANCE_CACHE_BUSTER_MS) {
      return;
    }

    if (transportMode !== null && isGoogleLoaded && position && googlePlaceId) {
      calculateDistance(transportMode, position, googlePlaceId);
    }
  }, [transportMode, position, googlePlaceId, isGoogleLoaded, cache, currentCacheKey]);

  return currentCacheKey in cache ? cache[currentCacheKey] : null
}
