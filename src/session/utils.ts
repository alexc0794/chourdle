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
