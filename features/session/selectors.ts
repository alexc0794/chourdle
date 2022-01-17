import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';


export const selectToken = (state: RootState) => state.session.user?.sessionToken?.token;

export const tokenSelector = createSelector(selectToken, state => state);