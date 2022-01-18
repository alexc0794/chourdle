import { RootState } from 'src/store';


export const selectActiveEvents = (state: RootState) => state.home.activeEvents.events;
