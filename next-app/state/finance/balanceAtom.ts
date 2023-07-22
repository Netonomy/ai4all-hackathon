import { atomWithStorage } from "jotai/utils";

export const balanceAtom = atomWithStorage<string | null>(
  "wallet-balance",
  null
);
