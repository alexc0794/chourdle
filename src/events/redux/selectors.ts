import { RootState } from "src/store";


export const selectEndedEvents = (state: RootState) => state.events.endedEvents;
