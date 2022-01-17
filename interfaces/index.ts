export * from "./user";
export * from "./event";

export interface Position {
  latitude: number;
  longitude: number;
}

export interface Eta {
  recordedAtMs: number;
  durationMs: number;
  distanceMeters: number;
  transportMode: TransportMode;
}

// Place - the entity representing an event location
export interface Place {
  position: Position;
  googlePlaceId?: string;
  mainText?: string;
  secondaryText?: string;
}

// TransportMode - types of modes a user can choose to use for transportation
export enum TransportMode {
  Walk,
  Car,
  Transit,
  // Lyft,
  // TODO: Lyft, Uber, other Transit APIs can unlock more modes
}