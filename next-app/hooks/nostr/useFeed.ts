import { pool, relays } from "@/config";
import { Event, SimplePool } from "nostr-tools";
import { useEffect, useState } from "react";

export default function useFeed() {
  const [feed, setFeed] = useState<Event<1>[] | null>(null);

  async function getFeed() {
    const events = await pool.list(relays, [
      {
        kinds: [1],
        limit: 10,
      },
    ]);

    setFeed(events);
  }

  useEffect(() => {
    getFeed();
  }, []);

  return feed;
}
