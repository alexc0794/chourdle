import NavBar from "@/components/NavBar";
import useLoginRedirect from "@/hooks/useLoginRedirect";
import { useRouter } from "next/router";


export default function Profile() {
  useLoginRedirect();

  const { query } = useRouter();
  const phoneNumber = query.phoneNumber as string || null;

  return (
    <>
      Profile {phoneNumber}
      <NavBar />
    </>
  )
}