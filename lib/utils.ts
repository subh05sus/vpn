import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateToken(): string {
  // Generate a random 32-byte hex string
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return (
    "0x" +
    Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  )
}

