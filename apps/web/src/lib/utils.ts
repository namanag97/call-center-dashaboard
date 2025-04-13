import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names using clsx and then merges Tailwind CSS classes using tailwind-merge
 * This utility function helps avoid class conflicts when combining Tailwind classes conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 