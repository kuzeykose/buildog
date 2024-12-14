import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decideWrapper = (tagName: "bold" | "italic" | "a") => {
  switch (tagName) {
    case "bold":
      return "strong";
    case "italic":
      return "em";
    default:
      return tagName;
  }
};
