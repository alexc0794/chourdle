import useLoginRedirect from "src/hooks/useLoginRedirect";
import NavBar from "@/components/NavBar";
import EventHistory from "src/events/EventHistory";


export default function Events() {
  useLoginRedirect();

  return (
    <>
      <EventHistory />
      <NavBar />
    </>
  )
}