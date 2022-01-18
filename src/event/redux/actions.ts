import { createAsyncThunk } from "@reduxjs/toolkit"
import { Event } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { fetchEvent as fetchEventApi } from "../api";


export const fetchEvent = createAsyncThunk(
  'event/fetchEvent',
  async (eventId: string, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) {
      throw new Error('no token');
    }
    const event: Event | null = await fetchEventApi(eventId, token);
    return event;
  }
);
