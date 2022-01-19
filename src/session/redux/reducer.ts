import { createReducer } from '@reduxjs/toolkit';
import { User } from '@/interfaces';
import { login, logout } from './actions';
import { getLocalStorageUser } from '../utils';


type SessionState = {
  user: User | null;
  pending: boolean;
  error: boolean;
};

const initialState: SessionState = {
  user: getLocalStorageUser(),
  pending: false,
  error: false,
};

export const sessionReducer = createReducer(initialState, builder => {
  builder
    .addCase(login.pending, state => {
      state.pending = true;
    })
    .addCase(login.rejected, state => {
      state.error = true;
    })
    .addCase(login.fulfilled, (state, { payload }) => {
      state.user = payload;
    })
    .addCase(logout, state => {
      state.user = null;
    })
});