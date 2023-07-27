import { Profile } from "@/types/Profile";
import { atomWithStorage } from "jotai/utils";

export const profileAtom = atomWithStorage<Profile | null>(
  "nostr-profile-event",
  null
);
