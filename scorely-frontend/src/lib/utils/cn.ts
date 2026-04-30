import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes intelligently — later classes win.
 * Use this anywhere you compose className from props + variants.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
