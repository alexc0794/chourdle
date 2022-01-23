import { selectPhoneNumber, selectToken } from "src/session/redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "./useRedux";


export default function useLoginRedirect() {
  const router = useRouter();
  const isLoggedIn = !!useAppSelector(selectToken);
  const phoneNumber = useAppSelector(selectPhoneNumber);

  useEffect(() => {
    if (router.isReady && !isLoggedIn) {
      router.push(`/login?${new URLSearchParams({
        redirect: router.asPath,
      })}`);
    }
  }, [isLoggedIn, router.isReady]);

  return {
    isLoggedIn,
    phoneNumber
  };
}