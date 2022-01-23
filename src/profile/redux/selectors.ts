import { RootState } from 'src/store';


export const selectUserStats = (state: RootState) => state.profile.userStats;
