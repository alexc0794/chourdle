import axios from "axios";
import { BASE_API_URL } from "@/config";
import {
  Event,
  EventUser,
  EventUserState,
  Place,
  Position,
  Eta,
  TransportMode,
} from "@/interfaces";


export async function fetchEvent(
  eventId: string,
  token: string | null
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log(BASE_API_URL);

  try {
    const response = await axios.get(`${BASE_API_URL}/event/${eventId}`, {
      headers,
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function joinEvent(
  eventId: string,
  transportMode: TransportMode | null,
  token: string
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event-user/join`,
      {
        eventId,
        transportMode,
      },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createEvent(
  name: string,
  place: Place,
  transportMode: TransportMode,
  token: string
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event/create`,
      { name, place, transportMode },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateEventName(
  eventId: string,
  name: string,
  token: string,
): Promise<boolean> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    await axios.post(
      `${BASE_API_URL}/event/name`,
      { eventId, name },
      { headers }
    );
    return true
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateEventUser(
  eventId: string,
  eventUser: EventUser,
  token: string
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event-user`,
      { eventId, eventUser },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateEventUserTransportMode(
  eventId: string,
  token: string,
  transportMode: TransportMode
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event-user/transport-mode`,
      { eventId, transportMode },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function transitionEventUserState(
  eventId: string,
  token: string,
  nextState: EventUserState | null,
  position: Position | null
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event-user/transition-state`,
      { eventId, nextState, position },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function addEventUserEta(
  eventId: string,
  token: string,
  eta: Eta
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event-user/add-eta`,
      { eventId, eta },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function scheduleEvent(
  eventId: string,
  token: string,
  scheduledForMs: number
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event/schedule`,
      { eventId, scheduledForMs },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function endEvent(
  eventId: string,
  token: string,
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event/end`,
      { eventId },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function inviteGuests(
  eventId: string,
  token: string,
  phoneNumbers: string[],
): Promise<Event | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.post(
      `${BASE_API_URL}/event/invite-guests`,
      { eventId, phoneNumbers },
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getPayouts(
  eventId: string,
  token: string,
): Promise<{ [phoneNumber: string]: number}> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.get(
      `${BASE_API_URL}/event/${eventId}/payouts`,
      { headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return {};
  }
}