import { createReducer } from '@reduxjs/toolkit';
import { User } from '@/interfaces';
import { login, logout } from './actions';


type SessionState = {
  user: User | null;
  pending: boolean;
  error: boolean;
};

const initialState: SessionState = (() => {
  const localStorageUser = typeof window !== 'undefined' && window.localStorage.getItem("user");
  let user: User | null = localStorageUser
    ? JSON.parse(localStorageUser)
    : null;
  if (user && user.sessionToken) {
    const expired = Date.now() - user.sessionToken?.tokenExpiresAtMs > 0;
    if (expired) {
      user = null;
    }
  }

  return {
    user,
    pending: false,
    error: false,
  }
})();

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