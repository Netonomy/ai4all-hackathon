import DigitalDocument from "@/types/DigitalDocument";
import { atomWithStorage } from "jotai/utils";

export const filesAtom = atomWithStorage<DigitalDocument[]>(
  "netonomy-docs",
  []
);
