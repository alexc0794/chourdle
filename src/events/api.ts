import axios from "axios";
import { Event } from "@/interfaces";
import { BASE_API_URL } from "@/config";


export async function fetchRecentlyEndedEvents(
  token: string | null,
): Promise<Array<Event>> {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios.get(`${BASE_API_URL}/recently-ended-events`, { headers });
    return response.data;
  } catch (e) {
    console.error(e);
    return [];
  }
}
