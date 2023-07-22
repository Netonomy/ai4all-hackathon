import { atomWithStorage } from "jotai/utils";

export const userDetailsAtom = atomWithStorage<UserDetails | null>(
  "cosmic-user-details",
  null
);
