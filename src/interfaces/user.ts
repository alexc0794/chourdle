import { TransportMode } from ".";


export interface User {
  name: string;
  phoneNumber: string;
  firstName: string;
  lastName: string | null;
  sessionToken: SessionToken | null;
}

export interface SessionToken {
  token: string;
  tokenGeneratedAtMs: number;
  tokenExpiresAtMs: number;
}

export interface Follower {
  followedPhoneNumber: string;
  followerPhoneNumber: string;
  followedAtMs: number;
  followerDebtMinutes: number; // If -5, follower owes 5 minutes to the followed. If 5, follower is owed 5 minutes by the followed
}

export interface UserStats {
  totalEvents: number | null;
  sumMinutes: number | null;
  avgMinutes: number | null;
  favoriteTransportMode: TransportMode | null;
}
