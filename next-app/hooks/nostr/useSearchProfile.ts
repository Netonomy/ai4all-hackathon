import { pool, relays } from "@/config";
import { Event, Filter, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

export default function useSearchProfile(searchText: string) {
  const [profiles, setProfiles] = useState<Event<0>[] | null>(null);

  async function search(searchText) {
    // searchText should be passed to the function
    if (searchText === "" || searchText === undefined) {
      setProfiles([]);
      return;
    }

    let type, data;

    if (searchText.length > 8) {
      try {
        const decodeResult = nip19.decode(searchText); // You need to handle errors here as well.
        type = decodeResult.type;
        data = decodeResult.data;
      } catch (err) {
        console.error("Error decoding text:", err);
      }
    }

    let query: Filter = {
      kinds: [0],
      limit: 50,
    };

    if (type === "npub") {
      query.authors = [data];
    } else {
      query.search = searchText;
    }

    try {
      const events = await pool.list(relays, [query]);
      setProfiles(events as Event<0>[]);
    } catch (err) {
      console.error("Error getting events:", err);
    }
  }

  useEffect(() => {
    search(searchText);
  }, [searchText]);

  return profiles;
}
