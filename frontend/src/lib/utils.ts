import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicAbsoluteURL(path: string) {
  return `${
    process.env.NEXT_PUBLIC_SITE_URL?.includes("138.128.242.42")
      ? "/boss-grand-garment"
      : ""
  }/${path}`.replace("//", "/");
}
