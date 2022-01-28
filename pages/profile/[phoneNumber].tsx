import NavBar from "@/components/NavBar";
import useLoginRedirect from "@/hooks/useLoginRedirect";
import { useRouter } from "next/router";
import ProfileNavBar from "src/profile/ProfileNavBar";
import UserStats from "src/profile/UserStats";


export default function Profile() {
  useLoginRedirect();

  const { query } = useRouter();
  const phoneNumber = query.phoneNumber as string || null;

  if (!phoneNumber) {
    return null;
  }

  return (
    <>
      <ProfileNavBar phoneNumber={phoneNumber} />
      <UserStats phoneNumber={phoneNumber} />
      <NavBar />
    </>
  );
}