import { createAsyncThunk } from "@reduxjs/toolkit";
import { Event } from "@/interfaces";
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { fetchRecentlyEndedEvents } from "../api";


export const fetchEndedEvents = createAsyncThunk(
  'events/fetchEndedEvents',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    const events: Event[] = await fetchRecentlyEndedEvents(token);
    return events;
  }
);
