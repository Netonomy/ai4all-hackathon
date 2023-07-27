import { pool, relays } from "@/config";
import { Event } from "nostr-tools";
import { useEffect, useState } from "react";

export default function useEventReactions(event: Event<1 | 6 | 65003>) {
  const [numReactions, setNumReactions] = useState<null | number>(null);

  async function fetchReactions() {
    const events = await pool.list(relays, [
      {
        "#e": [event.id],
        kinds: [7],
      },
    ]);

    setNumReactions(events.length);
  }

  useEffect(() => {
    fetchReactions();
  }, [event.id]);

  return numReactions;
}
