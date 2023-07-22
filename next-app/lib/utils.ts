import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayToFileList(array: File[]): FileList {
  const filelist = new DataTransfer();

  for (let i = 0; i < array.length; i++) {
    filelist.items.add(array[i]);
  }

  return filelist.files;
}

export function secondsToHMS(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  // Pad the minutes and seconds with leading zeros, if required
  const hDisplay = h > 0 ? h + ":" : "";
  const mDisplay = h > 0 ? (m < 10 ? "0" : "") + m + ":" : m + ":";
  const sDisplay = s < 10 ? "0" + s : s;

  return hDisplay + mDisplay + sDisplay;
}
