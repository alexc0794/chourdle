import { createReducer } from '@reduxjs/toolkit';
import { UserStats } from '@/interfaces';
import { fetchMyStats, fetchUserStats } from './actions';


type ProfileState = {
  userStats: UserStats | null;
  updatedAtMs: number | null;
  loading: boolean;
  error: boolean;
};

const initialProfileState: ProfileState = {
  userStats: null,
  updatedAtMs: null,
  loading: false,
  error: false,
};

export const profileReducer = createReducer(initialProfileState, builder => {
  builder
    .addCase(fetchUserStats.pending, state => {
      state.loading = true;
    })
    .addCase(fetchUserStats.rejected, state => {
      state.error = true;
    })
    .addCase(fetchMyStats.fulfilled, (state, { payload }) => {
      state.userStats = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(fetchUserStats.fulfilled, (state, { payload }) => {
      state.userStats = payload;
      state.updatedAtMs = Date.now();
    })
});
