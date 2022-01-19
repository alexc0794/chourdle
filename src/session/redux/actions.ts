import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { User } from "@/interfaces";
import { login as loginApi } from 'src/session/api';


export const logout = createAction('session/logout');

export const login = createAsyncThunk(
  'session/login',
  async (
    {phoneNumber, name}: {phoneNumber: string, name: string},
  ) => {
    const user: User | null = await loginApi(phoneNumber, name);
    if (user) {
      window.localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
  }
);
