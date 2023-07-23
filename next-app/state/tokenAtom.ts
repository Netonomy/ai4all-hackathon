import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<null | string>(
  "netonomy-bearer-token",
  null
);
