import { TransportMode } from "./interfaces";


export const TRANSPORT_MODE_TO_EMOJI = {
  [TransportMode.Walk]: '🚶‍♀️',
  [TransportMode.Car]: '🚘',
  [TransportMode.Transit]: '🚇',
}

// Used in context of "Alex is X min away ${action}"
// Also in context of "Alex may have arrived X min ago ${action}"
export const TRANSPORT_MODE_TO_ACTION: {
  [Key in TransportMode]: string | null;
} = {
  [TransportMode.Walk]: "walking",
  [TransportMode.Car]: "in a car",
  [TransportMode.Transit]: "on public transit",
  // [TransportMode.Lyft]: "in a Lyft"
};

export const TRANSPORT_MODE_TO_DIRECTIONS_MODE = {
  // See https://developers.google.com/maps/documentation/urls/ios-urlscheme#directions
  [TransportMode.Walk]: 'walking',
  [TransportMode.Car]: 'driving',
  [TransportMode.Transit]: 'transit',
}