import { createAsyncThunk } from "@reduxjs/toolkit"
import { Event } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { fetchActiveEvents as fetchActiveEventsApi } from "../api";


export const fetchActiveEvents = createAsyncThunk(
  'home/fetchActiveEvents',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) {
      throw new Error('no token');
    }
    const events: Event[] = await fetchActiveEventsApi(token);
    return events;
  }
);