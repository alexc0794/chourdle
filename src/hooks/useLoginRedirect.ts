import { selectToken } from "src/session/redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "./useRedux";


export default function useLoginRedirect() {
  const router = useRouter();
  const isLoggedIn = !!useAppSelector(selectToken);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?${new URLSearchParams({
        redirect: router.pathname,
      })}`);
    }
  }, [isLoggedIn]);
}