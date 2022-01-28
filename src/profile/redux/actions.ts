import { createAsyncThunk } from "@reduxjs/toolkit"
import { selectToken } from "src/session/redux";
import { RootState } from "src/store";
import { 
  fetchUserStats as fetchUserStatsApi,
  fetchMyStats as fetchMyStatsApi,
} from "../api";


export const fetchUserStats = createAsyncThunk(
  'profile/fetchUserStats',
  async (phoneNumber: string, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) {
      throw new Error('no token');
    }
    const userStats = await fetchUserStatsApi(phoneNumber, token);
    return userStats;
  }
);

export const fetchMyStats = createAsyncThunk(
  'profile/fetchMyStats',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = selectToken(state);
    if (!token) {
      throw new Error('no token');
    }
    const userStats = await fetchMyStatsApi(token);
    return userStats;
  }
);
