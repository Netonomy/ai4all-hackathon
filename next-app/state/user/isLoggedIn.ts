import { atomWithStorage } from "jotai/utils";

export const isLoggedInAtom = atomWithStorage("logged-in", false);
