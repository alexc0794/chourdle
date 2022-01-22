import useLoginRedirect from "src/hooks/useLoginRedirect";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";


export default function Events() {
  useLoginRedirect();

  useEffect(() => {
    async function load() {
    }
    load();
  }, []);
  return (
    <>
      Events
      <NavBar />
    </>
  )
}