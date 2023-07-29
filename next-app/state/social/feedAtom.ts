import { atomWithStorage } from "jotai/utils";
import { Event } from "nostr-tools";

export const feedAtom = atomWithStorage<Event<1 | 6 | 65003>[]>(
  "nullsocial-feed",
  []
);
