import { atomWithStorage } from "jotai/utils";
import { Event } from "nostr-tools";

export const postsAtom = atomWithStorage<Event<1>[]>("social-posts", []);
