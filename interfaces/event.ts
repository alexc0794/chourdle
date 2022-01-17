import { Place, Position, Eta, TransportMode } from ".";


export interface EventUserSettings {
  isLocationSharingEnabled: boolean;
}

export interface EventUserStateBase {
  timestampMs: number;
  position?: Position;
}

export enum EventUserState {
  unknown = "unknown",
  invited = "invited",
  joined = "joined",
  departed = "departed",
  arrived = "arrived",
}

export interface EventUserStates {
  current: EventUserState;
  next: EventUserState | null;
  joined?: EventUserStateBase;
  departed?: EventUserStateBase;
  arrived?: EventUserStateBase;
}

export interface EventUser {
  name?: string;
  phoneNumber: string;
  transportMode: TransportMode | null;
  etas: Array<Eta>;
  settings: EventUserSettings;
  states: EventUserStates;
  position?: Position; // Not everyone may allow for position to be shared
  profilePicUrl?: string;
}

// Event - the entity representing an organized event attended by users
export interface Event {
  eventId: string;
  eventName: string;
  eventUsers: Array<EventUser>;
  createdAtMs: number;
  createdByUserPhoneNumber: string;
  scheduledForMs: number | null;
  endedAtMs: number | null;
  place: Place; // TODO: Do we want this to be nullable?
  me: EventUser | null; // This field is derived on the backend by searching eventUsers for the requester
}

// LocallyStoredEvent [private] - the event metadata to be stored in browser's local storage
interface LocallyStoredEvent {
  eventId: string;
  eventName: string;
  scheduledForMs: number;
  transportMode: string; // Local storage won't recognize enums so save as string
  place: Place;
}

// RecentEvent - the event metadata from a recently attended event stored in local storage
export interface RecentEvent extends LocallyStoredEvent { }

// ActiveEvent - the event metadata from an active event stored in local storage
export interface ActiveEvent extends LocallyStoredEvent { }
