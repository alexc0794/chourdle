import { createAsyncThunk } from "@reduxjs/toolkit"
import { Event, EventUserState, Place, Position, TransportMode } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { 
  createEvent as createEventApi,
  fetchEvent as fetchEventApi, 
  updateEventName as updateEventNameApi,
  updateTransportMode as updateTransportModeApi,
  transitionEventUserState as transitionEventUserStateApi,
  endEvent as endEventApi,
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
  'event/createEvent',
  async (
    { name, place, transportMode}: { name: string, place: Place, transportMode: TransportMode },
    { getState },
  ): Promise<Event | null> => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }
    const event: Event | null = await createEventApi(name, place, transportMode, token);
    return event;
  }
);

export const updateEventName = createAsyncThunk(
  'event/updateEventName',
  async (
    {eventId, name}: {eventId: string, name: string},
    { getState },
  ) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) { throw new Error('no token'); }

    await updateEventNameApi(eventId, name, token);
  }
);

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