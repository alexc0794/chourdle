import { User } from "@/interfaces";

export const getLocalStorageUser = (): User | null => {
  const localStorageUser = typeof window !== 'undefined' && window.localStorage.getItem("user");
  let user: User | null = localStorageUser
    ? JSON.parse(localStorageUser)
    : null;
  if (user && user.sessionToken) {
    const expired = Date.now() - user.sessionToken?.tokenExpiresAtMs > 0;
    if (expired) {
      user = null;
    }
  }
  return user;
};


export function validatePhoneNumber(phoneNumber: string): boolean {
  let re = /^(0|[1-9][0-9]*)$/;
  if (phoneNumber.length !== 10 || !re.test(phoneNumber)) {
    return false;
  }
  return true;
}


export function sanitizePhoneNumber(phoneNumber: string): string {
  const PHONE_NUMBER_LENGTH = 10;
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (numericPhoneNumber.length > PHONE_NUMBER_LENGTH) {
    return numericPhoneNumber.substring(numericPhoneNumber.length - PHONE_NUMBER_LENGTH);
  }
  return numericPhoneNumber;
}