import { EventUser } from "@/interfaces";


export function sortEventUsers(userA: EventUser, userB: EventUser) {
  // If user has arrived, that should take precedence over ETA
  if (userA.states.arrived && !userB.states.arrived) {
    return -1;
  } else if (userB.states.arrived && !userA.states.arrived) {
    return 1;
  }

  if (userA.states.arrived && userB.states.arrived) {
    return userA.states.arrived.timestampMs - userB.states.arrived.timestampMs;
  }

  const userAEta = userA.etas.length > 0 ? userA.etas[userA.etas.length - 1] : null;
  const userBEta = userB.etas.length > 0 ? userB.etas[userB.etas.length - 1] : null;
  if (userAEta === null) {
    return 1;
  } else if (userBEta === null) {
    return -1;
  }
  return ((userAEta.durationMs + userAEta.recordedAtMs) - (userBEta.durationMs + userBEta.recordedAtMs));
}
