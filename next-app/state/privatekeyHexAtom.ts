import { atomWithStorage } from "jotai/utils";

export const privateKeyHexAtom = atomWithStorage<string | null>(
  "privateKeyHex",
  null
);
