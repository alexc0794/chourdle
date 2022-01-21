import axios from "axios";
import { BASE_API_URL } from "@/config";
import { User } from "@/interfaces";


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
