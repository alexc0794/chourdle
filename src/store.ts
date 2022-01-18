import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { homeReducer } from './home/redux';
import { sessionReducer } from './session/redux';


export const store = configureStore({
  reducer: {
    session: sessionReducer,
    home: homeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
 >;