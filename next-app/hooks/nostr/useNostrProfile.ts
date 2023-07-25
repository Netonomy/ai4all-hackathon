import { pool, relays } from "@/config";
import { Profile } from "@/types/Profile";
import { Event } from "nostr-tools";
import { useEffect, useState } from "react";

export default function useNostrProfile(pubKey: string) {
  const [profile, setProfile] = useState<Event<0> | null>(null);

  async function fetchProfile() {
    const event = await pool.list(relays, [
      {
        kinds: [0],
        authors: [pubKey],
      },
    ]);

    if (event[0]) {
      setProfile(event[0]);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return profile;
}
