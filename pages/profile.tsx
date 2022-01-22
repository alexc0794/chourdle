import NavBar from "@/components/NavBar";
import useLoginRedirect from "@/hooks/useLoginRedirect";


export default function Profile() {
  useLoginRedirect();

  return (
    <>
      Profile
      <NavBar />
    </>
  )
}