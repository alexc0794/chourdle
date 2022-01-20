import { Event, EventUser } from '@/interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { selectPhoneNumber } from 'src/session/redux';
import { RootState } from 'src/store';


export const selectEvent = (state: RootState) => state.event.activeEvent.event;

export const selectMe = createSelector(
  selectEvent,
  selectPhoneNumber,
  (event: Event | null, phoneNumber: string | null): EventUser | null => 
    event && phoneNumber
      ? event.eventUsers.find(
          (eventUser) => eventUser.phoneNumber === phoneNumber
        ) || null
      : null
);

export const selectTransportMode = (state: RootState) => state.event.transportMode;

export const selectEta = createSelector(
  selectEvent,
  selectPhoneNumber,
  (event: Event | null, phoneNumber: string | null) => {
    const me = event && phoneNumber ? event.eventUsers.find(
      (eventUser) => eventUser.phoneNumber === phoneNumber
    ) : null
    if (me && me.etas.length > 0) {
      return me.etas[me.etas.length - 1];
    }
    return null;
  }
);