import VideoObject from "@/types/VideoObject";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const videosAtom = atomWithStorage<VideoObject[]>("netonomy-videos", []);

export const selectingVideosAtom = atom(false);

export const selectedVideosAtom = atom<VideoObject[]>([]);
