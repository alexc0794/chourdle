import { createAsyncThunk } from "@reduxjs/toolkit"
import { Eta, Event, EventUserState, Place, Position, TransportMode } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { 
  addEventUserEta as addEventUserEtaApi,
  createEvent as createEventApi,
  fetchEvent as fetchEventApi, 
  inviteGuests as inviteGuestsApi,
  updateEventName as updateEventNameApi,
  updateTransportMode as updateTransportModeApi,
  transitionEventUserState as transitionEventUserStateApi,
  endEvent as endEventApi,
  scheduleEvent as scheduleEventApi,
} from "../api";


export const fetchEvent = createAsyncThunk(
  'event/fetchEvent',
  async (eventId: string, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    const event: Event | null = await fetchEventApi(eventId, token);
    return event;
  }
);

export const createEvent = createAsyncThunk(
  'event/create',
  async (
    { name, place, transportMode}: { name: string, place: Place, transportMode: TransportMode },
    { getState },
  ): Promise<Event | null> => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    return await createEventApi(name, place, transportMode, token);
  }
);

export const updateEventName = createAsyncThunk(
  'event/updateName',
  async (
    {eventId, name}: {eventId: string, name: string},
    { getState },
  ) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    return await updateEventNameApi(eventId, name, token);
  }
);

export const scheduleEvent = createAsyncThunk(
  'event/schedule',
  async (
    { eventId, scheduledForMs }: { eventId: string, scheduledForMs: number },
    { getState },
  ) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    return await scheduleEventApi(eventId, token, scheduledForMs);
  }
);

export const inviteGuests = createAsyncThunk(
  'event/inviteGuests',
  async (
    { eventId, phoneNumbers }: { eventId: string, phoneNumbers: string[] },
    { getState },
  ) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    return await inviteGuestsApi(eventId, token, phoneNumbers);
  }
);

export const addEventUserEta = createAsyncThunk(
  'event/addEventUserEta',
  async (
    { eventId, eta }: { eventId: string, eta: Eta },
    { getState }
  ): Promise<Event | null> => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }
    
    const event = await addEventUserEtaApi(eventId, token, eta);
    return event;
  }
)

export const updateTransportMode = createAsyncThunk(
  'event/updateTransportMode',
  async (
    {eventId, transportMode}: {eventId: string, transportMode: TransportMode},
    { getState },
  ): Promise<Event> => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    const event = await updateTransportModeApi(eventId, token, transportMode);
    if (!event) { throw new Error('failed'); }
    
    return event;
  }
);

export const transitionEventUserState = createAsyncThunk(
  'event/transitionEventUserState',
  async (
    { 
      eventId, 
      nextState, 
      position 
    }: {
      eventId: string,
      nextState: EventUserState | null,
      position: Position | null
    },
    { getState },
  ): Promise<Event> => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    const event = await transitionEventUserStateApi(
      eventId,
      token,
      nextState,
      position
    );
    if (!event) { throw new Error('failed'); }
    
    return event;
  }
);

export const endEvent = createAsyncThunk(
  'event/endEvent',
  async (eventId: string, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    const event = await endEventApi(eventId, token);
    if (!event) { throw new Error('failed'); }
    
    return event;
  }
);
