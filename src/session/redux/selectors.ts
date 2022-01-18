import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';


export const selectToken = (state: RootState) => state.session.user?.sessionToken?.token || null;

export const tokenSelector = createSelector(selectToken, state => state);