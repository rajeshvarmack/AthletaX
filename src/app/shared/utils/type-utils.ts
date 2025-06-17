/**
 * Type-safe utility functions for the application
 */

/**
 * Type guard to check if a value is not null or undefined
 */
export function isNotNullOrUndefined<T>(
  value: T | null | undefined
): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if a value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
}

/**
 * Create a throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let isThrottled = false;

  return (...args: Parameters<T>) => {
    if (!isThrottled) {
      func(...args);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
}

/**
 * Format numbers with locale-specific formatting
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if the current environment supports a given feature
 */
export function supportsFeature(
  feature: 'localStorage' | 'sessionStorage' | 'serviceWorker' | 'webgl'
): boolean {
  try {
    switch (feature) {
      case 'localStorage':
        return typeof localStorage !== 'undefined';
      case 'sessionStorage':
        return typeof sessionStorage !== 'undefined';
      case 'serviceWorker':
        return 'serviceWorker' in navigator;
      case 'webgl': {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        );
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}
