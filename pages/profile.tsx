import useLoginRedirect from "@/hooks/useLoginRedirect";


export default function Profile() {
  useLoginRedirect();

  return (
    <div>
      Profile
    </div>
  )
}