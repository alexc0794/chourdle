import { RootState } from 'src/store';


export const selectToken = (state: RootState) => state.session.user?.sessionToken?.token || null;
export const selectPhoneNumber = (state: RootState) => state.session.user?.phoneNumber || null;
