import { pool, relays } from "@/config";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { feedAtom } from "@/state/social/feedAtom";
import { useAtom } from "jotai";
import {
  Event,
  SimplePool,
  getEventHash,
  getPublicKey,
  getSignature,
  nip19,
} from "nostr-tools";
import { useEffect, useState } from "react";

export default function useFeed() {
  const [feed, setFeed] = useAtom(feedAtom);
  const [privateKeyHex] = useAtom(privateKeyHexAtom);

  async function getFeed() {
    if (privateKeyHex) {
      const pubKey = getPublicKey(privateKeyHex!);

      // Create Job Request for algorithmic feed
      let jobRequestEvent: any = {
        kind: 65006,
        pubkey: pubKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["output", "application/json"]],
        content: "",
      };
      jobRequestEvent.id = getEventHash(jobRequestEvent);
      jobRequestEvent.sig = getSignature(jobRequestEvent, privateKeyHex);

      // Publish Job
      let pubs = pool.publish(relays, jobRequestEvent);
      pubs.on("ok", () => {
        console.log("published okay");
      });
      pubs.on("failed", () => {
        console.log("Failed to publish job result");
      });

      // Wait data vending machine response
      let jobResponsePubs = pool.sub(relays, [
        {
          "#e": [jobRequestEvent.id],
          kinds: [65001],
        },
      ]);

      jobResponsePubs.on("event", (event) => {
        const eventsFeed = JSON.parse(event.content);
        setFeed(eventsFeed);
      });
    }
  }

  useEffect(() => {
    // getFeed();
  }, [privateKeyHex]);

  return feed;
}
