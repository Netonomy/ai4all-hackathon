import { atomWithStorage } from "jotai/utils";

export const firstLoginAtom = atomWithStorage("first-log-in", true);
