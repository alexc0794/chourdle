import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { homeReducer } from './home/redux';
import { sessionReducer } from './session/redux';
import { eventReducer } from './event/redux';
import { profileReducer } from './profile/redux';


const combinedReducer = combineReducers({
  session: sessionReducer,
  home: homeReducer,
  event: eventReducer,
  profile: profileReducer,
});

const reducer = (
  state: ReturnType<typeof combinedReducer> | undefined,  // Had to add undefined type to fix ts errors
  action: AnyAction,
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store['dispatch'];
export type RootState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore);
