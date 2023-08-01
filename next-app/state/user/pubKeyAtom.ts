import { atomWithStorage } from "jotai/utils";

export const pubKeyAtom = atomWithStorage<string | null>("pubkey", null);
