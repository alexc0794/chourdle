import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { Event, TransportMode } from '@/interfaces';
import { endEvent, fetchEvent, inviteGuests, joinEvent, scheduleEvent, transitionEventUserState } from './actions';
import { updateTransportMode } from '.';


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

const activeEventReducer = createReducer(initialActiveEventState, builder => {
  builder
    .addCase(fetchEvent.pending, state => {
      state.loading = true;
    })
    .addCase(fetchEvent.rejected, state => {
      state.loading = false;
      state.error = true;
    })
    .addCase(fetchEvent.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(updateTransportMode.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(inviteGuests.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(scheduleEvent.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(transitionEventUserState.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(joinEvent.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
    .addCase(endEvent.fulfilled, (state, { payload }) => {
      state.event = payload;
      state.updatedAtMs = Date.now();
    })
});


type TransportModeState = {
  loading: boolean;
  error: boolean;
  transportMode: TransportMode | null;
};

const initialTransportModeState: TransportModeState = {
  loading: false,
  error: false,
  transportMode: null,
};

const transportModeReducer = createReducer(initialTransportModeState, builder => {
  builder
    .addCase(updateTransportMode.pending, (state, { meta }) => {
      state.loading = true;
      state.transportMode = meta.arg.transportMode;
    })
    .addCase(updateTransportMode.rejected, state => {
      state.error = true;
      state.transportMode = null;
    })
    .addCase(updateTransportMode.fulfilled, state => {
      state.loading = false;
      state.error = false;
    })
});

export const eventReducer = combineReducers({
  activeEvent: activeEventReducer,
  transportMode: transportModeReducer
});
