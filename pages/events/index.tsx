import useLoginRedirect from "src/hooks/useLoginRedirect";
import { useEffect } from "react";


export default function Events() {
  useLoginRedirect();

  useEffect(() => {
    async function load() {
    }
    load();
  }, []);
  return (
    <div>
      Events
    </div>
  )
}