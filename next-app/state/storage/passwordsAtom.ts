import Password from "@/types/Password";
import { atomWithStorage } from "jotai/utils";

export const passwordsAtom = atomWithStorage<Password[]>(
  "netonomy-passwords",
  []
);
