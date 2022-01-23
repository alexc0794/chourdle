import { createAsyncThunk } from "@reduxjs/toolkit"
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { fetchUserStats as fetchActiveEventsApi } from "../api";


export const fetchUserStats = createAsyncThunk(
  'profile/fetchUserStats',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) {
      throw new Error('no token');
    }
    const userStats = await fetchActiveEventsApi(token);
    return userStats;
  }
);
