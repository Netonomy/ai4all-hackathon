"use client";
import { useEffect, useState } from "react";
import useWeb5 from "./useWeb5";
import { useAtom } from "jotai";
import { personAtom } from "@/state/user/personAtom";
import { Event, SimplePool, getPublicKey } from "nostr-tools";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { Profile } from "@/types/Profile";

const pool = new SimplePool();

let relays = ["wss://relay.snort.social"];

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { web5 } = useWeb5();
  const [privateKey] = useAtom(privateKeyHexAtom);

  async function getProfile() {
    if (privateKey && web5) {
      const pubKey = getPublicKey(privateKey);
      const event = await pool.list(relays, [
        {
          kinds: [0],
          authors: [pubKey],
        },
      ]);

      if (event.length > 0) {
        let profile: Profile = JSON.parse(event[0].content);

        // fetch the profile image
        if (profile.picture) {
          const { record } = await web5!.dwn.records.read({
            message: {
              recordId: profile.picture,
            },
          });

          const blob = await record.data.blob();
          const blobUrl = URL.createObjectURL(blob);

          profile.picture = blobUrl;
        }

        setProfile(profile);
      }
    }
  }

  useEffect(() => {
    // fetchProfile();
    getProfile();
  }, [privateKey, web5]);

  return { profile };
}
