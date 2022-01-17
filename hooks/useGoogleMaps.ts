import { useEffect, useState } from "react";
import loadGoogleMapsAPI from "load-google-maps-api";

// Global variable to ensure we only attempt to load Google once
let globalAttempted = false;

// Global variable to determine whether we've previously loaded Google already
let globalLoaded = false;

// Cache an array of setLoaded functions that are called after
//  1. An attempt to load Google has already been made
//  2. Google has not yet finished loading
// Once Google finishes loading, we call not only want to call setLoaded on the
// first attempt, but also on all of the silenced attempts that we cached.
let cachedCallbacks: Array<(b: boolean) => void> = [];

export default function useGoogleMaps(): boolean {
  const [loaded, setLoaded] = useState<boolean>(globalLoaded);

  async function loadGoogleMaps() {
    globalAttempted = true;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    await loadGoogleMapsAPI({
      key,
      libraries: ["places"]
    });
    globalLoaded = true;
    setLoaded(true);
    cachedCallbacks.forEach(callback => callback(true));
    cachedCallbacks = [];
  }

  useEffect(() => {
    if (!globalLoaded) {
      if (globalAttempted) {
        cachedCallbacks.push(setLoaded);
        return;
      }
      loadGoogleMaps();
    } else {
      setLoaded(true);
    }
  }, []);

  return loaded || globalLoaded;
}
