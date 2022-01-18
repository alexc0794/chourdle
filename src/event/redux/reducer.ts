import { createReducer } from '@reduxjs/toolkit';
import { Event } from '@/interfaces';
import { fetchEvent } from './actions';


type ActiveEventState = {
  event: Event | null;
  updatedAtMs: number | null;
  loading: boolean;
  error: boolean;
};

const initialActiveEventState: ActiveEventState = {
    event: null,
    updatedAtMs: null,
    loading: false,
    error: false,
};

export const activeEventReducer = createReducer(initialActiveEventState, builder => {
  builder
    .addCase(fetchEvent.pending, state => {
      state.loading = true;
    })
    .addCase(fetchEvent.rejected, state => {
      state.error = true;
    })
    .addCase(fetchEvent.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
});
