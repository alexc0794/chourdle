import axios from "axios";
import { BASE_API_URL } from "@/config";
import { User, UserStats } from "@/interfaces";


export async function getFollowers(token: string): Promise<User[]> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.get(`${BASE_API_URL}/followers`, { headers });
    return response.data.users;
  } catch (e) {
    console.error(e);
    return [];
  }
}


export async function getFollowing(token: string): Promise<User[]> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.get(`${BASE_API_URL}/following`, { headers });
    return response.data.users;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchUserStats(phoneNumber: string, token: string): Promise<UserStats | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.get(`${BASE_API_URL}/user-stats/${phoneNumber}`, { headers });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchMyStats(token: string): Promise<UserStats | null> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.get(`${BASE_API_URL}/user-stats`, { headers });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

