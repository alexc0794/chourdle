import { RootState } from 'src/store';


export const selectEvent = (state: RootState) => state.activeEvent.event;
