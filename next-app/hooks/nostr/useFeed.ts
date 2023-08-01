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

export default function useFeed(eventId: string) {
  const [feed, setFeed] = useState<any[]>([]);

  async function getFeed() {
    await (window as any).webln.enable();
    const pubkey = await (window as any).nostr.getPublicKey();
    console.log(pubkey);

    const event = await pool.get(relays, {
      ids: [eventId],
    });

    console.log(event);

    if (event) {
      const events = JSON.parse(event.content);

      setFeed(events);
    }

    // // Create Job Request for algorithmic feed
    // let jobRequestEvent: any = {
    //   kind: 65006,
    //   pubkey: pubkey,
    //   created_at: Math.floor(Date.now() / 1000),
    //   tags: [["output", "application/json"]],
    //   content: "",
    // };
    // console.log(jobRequestEvent);
    // jobRequestEvent.id = getEventHash(jobRequestEvent);
    // // jobRequestEvent.sig = getSignature(jobRequestEvent, privateKeyHex);

    // // const msg = await (window as any).webln.signMessage(jobRequestEvent);
    // // console.log(msg);
    // // jobRequestEvent.sig = msg.signature;

    // // Publish Job
    // let pubs = pool.publish(relays, jobRequestEvent);
    // pubs.on("ok", () => {
    //   console.log("published okay");
    // });
    // pubs.on("failed", () => {
    //   console.log("Failed to publish job result");
    // });

    // // Wait data vending machine response
    // let jobResponsePubs = pool.sub(relays, [
    //   {
    //     "#e": [jobRequestEvent.id],
    //     kinds: [65001],
    //   },
    // ]);

    // jobResponsePubs.on("event", (event) => {
    //   const eventsFeed = JSON.parse(event.content);
    //   setFeed(eventsFeed);
    // });
  }

  useEffect(() => {
    getFeed();
  }, []);

  return feed;
}
