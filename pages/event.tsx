import { useEffect } from "react"
import { fetchEvent } from "@/components/event/api";


export default function Event() {
  useEffect(() => {
    async function load() {
      console.log(await fetchEvent('1', null));
    }
    load();
  }, []);
  return (
    <div>
      Event
    </div>
  )
}