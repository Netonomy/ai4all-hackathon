import { Person } from "@/types/Person";
import { atomWithStorage } from "jotai/utils";

export const personAtom = atomWithStorage<Person | null>("Person", null);
