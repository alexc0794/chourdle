import { createAsyncThunk } from "@reduxjs/toolkit"
import { Event, TransportMode } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { 
  fetchEvent as fetchEventApi, 
  updateEventName as updateEventNameApi,
  updateTransportMode as updateTransportModeApi,
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
