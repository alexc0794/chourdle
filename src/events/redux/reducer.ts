import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { Event } from '@/interfaces';
import { fetchEndedEvents } from './actions';


type EndedEventsState = {
  events: Event[];
  updatedAtMs: number | null;
  loading: boolean;
  error: boolean;
};

const initialEndedEventsState: EndedEventsState = {
  events: [],
  updatedAtMs: null,
  loading: false,
  error: false,
};

const endedEventsReducer = createReducer(initialEndedEventsState, builder => {
  builder
    .addCase(fetchEndedEvents.pending, state => {
      state.loading = true;
      state.error = false;
    })
    .addCase(fetchEndedEvents.rejected, state => {
      state.loading = false;
      state.error = true;
    })
    .addCase(fetchEndedEvents.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.events = payload;
      state.updatedAtMs = Date.now();
    })
});

export const eventsReducer = combineReducers({
  endedEvents: endedEventsReducer,
});
