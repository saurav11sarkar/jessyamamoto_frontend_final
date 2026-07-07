import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes location strings (country/city names) for comparison so that
 * legacy free-typed values and canonical dropdown values match regardless
 * of casing or stray whitespace.
 */
export function normalizeLocationName(value?: string | null): string {
  return (value ?? "").trim().toLowerCase()
}

export function isSameLocationName(
  a?: string | null,
  b?: string | null,
): boolean {
  return normalizeLocationName(a) === normalizeLocationName(b)
}
