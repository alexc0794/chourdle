import { createAsyncThunk } from "@reduxjs/toolkit"
import { Event } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { 
  fetchEvent as fetchEventApi, 
  updateEventName as updateEventNameApi
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
