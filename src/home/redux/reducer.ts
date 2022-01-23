import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { Event } from '@/interfaces';
import { fetchActiveEvents } from './actions';


type ActiveEventsState = {
  events: Event[];
  updatedAtMs: number | null;
  loading: boolean;
  error: boolean;
};

const initialActiveEventsState: ActiveEventsState = {
  events: [],
  updatedAtMs: null,
  loading: false,
  error: false,
};

const activeEventsReducer = createReducer(initialActiveEventsState, builder => {
  builder
    .addCase(fetchActiveEvents.pending, state => {
      state.loading = true;
    })
    .addCase(fetchActiveEvents.rejected, state => {
      state.error = true;
    })
    .addCase(fetchActiveEvents.fulfilled, (state, { payload }) => {
      state.events = payload;
      state.updatedAtMs = Date.now();
    })
});

export const homeReducer = combineReducers({
  activeEvents: activeEventsReducer
});