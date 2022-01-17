import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { login as loginApi } from '@/components/login/api';
import { User } from "@/interfaces";


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
)