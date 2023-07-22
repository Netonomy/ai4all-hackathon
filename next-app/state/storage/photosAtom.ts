import ImageObject from "@/types/ImageObject";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const photosAtom = atomWithStorage<ImageObject[]>("netonomy-photos", []);

export const selectingPhotosAtom = atom(false);

export const selectedPhotosAtom = atom<ImageObject[]>([]);
