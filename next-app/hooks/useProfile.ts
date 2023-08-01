"use client";
import { useEffect, useState } from "react";
import useWeb5 from "./useWeb5";
import { useAtom } from "jotai";
import { personAtom } from "@/state/user/personAtom";
import { Event, SimplePool, getPublicKey, nip19 } from "nostr-tools";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { Profile } from "@/types/Profile";
import { pool, relays } from "@/config";
import { profileAtom } from "@/state/user/profileAtom";

export default function useProfile() {
  const [profile, setProfile] = useAtom(profileAtom);
  const { web5 } = useWeb5();
  // const [privateKey] = useAtom(privateKeyHexAtom);
  const [bannerImg, setBannerImg] = useState<Blob | null>(null);

  async function getProfile() {
    if (web5) {
      try {
        await (window as any).webln.enable();
        const pubkey = await (window as any).nostr.getPublicKey();

        const npub = nip19.npubEncode(pubkey);

        const sub = pool.sub(relays, [
          {
            kinds: [0],
            authors: [pubkey],
          },
        ]);

        sub.on("event", async (event) => {
          if (event) {
            let profile: Profile = JSON.parse(event.content);
            profile.npub = npub;

            // fetch the profile image
            if (profile.picture) {
              const { record } = await web5!.dwn.records.read({
                message: {
                  recordId: profile.picture,
                },
              });

              if (record) {
                const blob = await record.data.blob();
                const blobUrl = URL.createObjectURL(blob);

                profile.picture = blobUrl;
              }
            }

            // fetch the banner image
            if (profile.banner) {
              const { record } = await web5!.dwn.records.read({
                message: {
                  recordId: profile.banner,
                },
              });

              if (record) {
                const blob = await record.data.blob();
                const blobUrl = URL.createObjectURL(blob);

                profile.banner = blobUrl;

                setBannerImg(blob);
              }
            }

            setProfile(profile);
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    getProfile();
  }, [web5]);

  return { profile, bannerImg };
}
