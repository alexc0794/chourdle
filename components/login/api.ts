import axios from "axios";
import { BASE_API_URL } from "../../config";
import { User } from "../../interfaces";


export async function login(
  phoneNumber: string,
  name: string | null
): Promise<User | null> {
  try {
    const response = await axios.post(`${BASE_API_URL}/login`, {
      phoneNumber,
      name,
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function checkVerification(phoneNumber: string): Promise<boolean> {
  try {
    const response = await axios.post(`${BASE_API_URL}/check-verification`, {phoneNumber});
    return response.data;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function verify(phoneNumber: string, code: string): Promise<boolean> {
  try {
    await axios.post(`${BASE_API_URL}/verify`, {
      phoneNumber,
      code,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
