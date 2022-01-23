import NavBar from "@/components/NavBar";
import useLoginRedirect from "@/hooks/useLoginRedirect";
import ProfileNavBar from "src/profile/ProfileNavBar";
import UserStats from "src/profile/UserStats";


export default function Profile() {
  const { phoneNumber } = useLoginRedirect();
  if (!phoneNumber) {
    return null;
  }

  return (
    <>
      <ProfileNavBar phoneNumber={phoneNumber} />
      <UserStats />
      <NavBar />
    </>
  );
}
